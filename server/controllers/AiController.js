import pdfParse from "pdf-parse/lib/pdf-parse.js";
import axios from "axios";
import { skillsList } from "./mock.js";
import ResumePool from "../models/ResumePool.js";
import { topCompanieslist, topInstituteslist } from "./mock.js";
import fs from "fs/promises";
import path from "path";
import xlsx from "xlsx";
import FormData from "form-data";
import { Readable } from "stream";
import { uploadJsonAsCsvToS3 } from "../utils/UploadChecker.js";
import filterAndRankCandidates from "../utils/filterRank.js"
import { fileURLToPath } from 'url';

const GEMINI_API_KEY = "AIzaSyCXj7iUCYWDQXPW3i6ky4Y24beLiINeDBw";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extractYear = (input) => {
  if (!input) return null;

  // If it's already a valid number (like 2023), return it directly
  if (typeof input === "number" && input > 1900 && input < 2100) {
    return input;
  }

  if (typeof input !== "string") return null;

  const match = input.match(/\d{2,4}/g); // Match any 2-4 digit numbers
  if (match) {
    const rawYear = match[match.length - 1]; // pick the last one (often most relevant)
    const year = rawYear.length === 2 ? "20" + rawYear : rawYear;
    return Number(year);
  }

  return null;
};



export const parseResume = async (req, res) => {
  try {
    console.log("Received request to parse resume.");

    if (!req.file) {
      console.log("No file uploaded.");
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    console.log("File uploaded successfully, starting PDF parsing...");

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    console.log("PDF parsed successfully.");

    const resumeText = pdfData.text.trim();
    console.log("Extracted text length:", resumeText.length);

    if (!resumeText) {
      console.log("Extracted text is empty.");
      return res
        .status(400)
        .json({ success: false, message: "Empty resume text" });
    }

    console.log("Sending text to Gemini API...");

    // Send text to Gemini API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Extract structured information from the following resume and return a **properly formatted JSON object** with the following fields:

- **PersonalInformation:**
  - name (Full name of the candidate)
  - email (Email address)
  - contactNumber (Phone number)
  - linkedinLink (URL to the candidate’s LinkedIn profile)
  - dateOfBirth (Candidate’s date of birth)
  - location (Current city/location)

- **ProfessionalDetails:**
  - noOfYearsExperience (Total years of work experience)
  - currentCompany (Company where the candidate is currently employed)
  - currentDesignation (Current job title/designation)
  - salary (Current or expected salary, if mentioned)
  - about (A brief professional summary of the candidate)
  - hasConsultingBackground (Boolean - true if the candidate has consulting experience, otherwise false)

- **EducationDetails** (An array of objects, each containing):
  - instituteName (Name of the university or college)
  - yearOfPassout (Year of graduation or completion)

- **WorkExperience** (An array of objects, each containing):
  - companyName (Name of the company)
  - jobTitle (Job designation/role at the company)
  - duration (Employment period, e.g., "Jan 2020 - Dec 2023")
  - responsibilities (An array of key responsibilities and contributions in this role)

- **OtherDetails:**
  - companiesWorkedAt (An array of company names where the candidate has worked)
  - jobRoles (An array of job titles the candidate has held)

**AdditionalInstructions:**
- If any field is missing, return an empty string ("") or an empty array ([]) as applicable.
- The JSON response **must** follow this structure without additional formatting or explanations.
- Ensure proper parsing for employment **duration and responsibilities**.

**Resume Content:**  
${resumeText}`,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Received response from Gemini API.");

    // Extract response text
    const rawText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Raw extracted text:", rawText);

    // Extract multiple JSON blocks
    const jsonMatches = rawText.match(/```json\n([\s\S]*?)\n```/g);
    if (!jsonMatches) {
      return res
        .status(500)
        .json({ success: false, message: "Invalid API response format" });
    }

    // Parse and merge JSON objects
    let parsedData = {};
    jsonMatches.forEach((jsonBlock) => {
      try {
        const jsonString = jsonBlock.replace(/```json\n|\n```/g, "").trim();
        const parsedObject = JSON.parse(jsonString);
        parsedData = { ...parsedData, ...parsedObject };
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    });

    console.log("Parsed JSON data successfully:", parsedData);

    const isTopCompany = topCompanieslist.some((company) =>
      new RegExp(`\\b${company}\\b`, "i").test(resumeText)
    );

    // Check if any top institute is mentioned in the resume
    const isTopInstitute = topInstituteslist.some((institute) =>
      new RegExp(`\\b${institute}\\b`, "i").test(resumeText)
    );

    // Extract skills based on predefined list
    const detectedSkills = skillsList.filter((skill) =>
      new RegExp(`\\b${skill}\\b`, "i").test(resumeText)
    );

    // Ensure all required fields exist, with defaults
    const defaultFields = {
      skills: detectedSkills.length > 0 ? detectedSkills : ["Not Mentioned"],
      topCompanies: isTopCompany,
      topInstitutes: isTopInstitute,
      PersonalInformation: {
        name: parsedData.PersonalInformation?.name || "",
        email: parsedData.PersonalInformation?.email || "",
        contactNumber: parsedData.PersonalInformation?.contactNumber || "",
        linkedinLink: parsedData.PersonalInformation?.linkedinLink || "",
        dateOfBirth: parsedData.PersonalInformation?.dateOfBirth || "",
        location: parsedData.PersonalInformation?.location || "",
      },

      ProfessionalDetails: {
        noOfYearsExperience:
          parsedData.ProfessionalDetails?.noOfYearsExperience || "",
        currentCompany: parsedData.ProfessionalDetails?.currentCompany || "",
        currentDesignation:
          parsedData.ProfessionalDetails?.currentDesignation || "",
        salary: parsedData.ProfessionalDetails?.salary || "",
        about: parsedData.ProfessionalDetails?.about || "",
        hasConsultingBackground:
          parsedData.ProfessionalDetails?.hasConsultingBackground || false, // Ensuring consulting background field
      },

      EducationDetails: parsedData.EducationDetails || [],
      WorkExperience: parsedData.WorkExperience || [],

      OtherDetails: {
        companiesWorkedAt: parsedData.OtherDetails?.companiesWorkedAt || [],
        jobRoles: parsedData.OtherDetails?.jobRoles || [],
      },
    };

    parsedData = { ...defaultFields, ...parsedData };

   const email = parsedData.PersonalInformation?.email;
    if (email) {
    const existing = await ResumePool.findOne({ 'personalInformation.email': email });

    if (existing) {
      // Update existing record
      await ResumePool.updateOne(
        { _id: existing._id },
        {
          personalInformation: {
        name: parsedData.PersonalInformation?.name || "",
        email: parsedData.PersonalInformation?.email || "",
        contactNumber: parsedData.PersonalInformation?.contactNumber || "",
        linkedinLink: parsedData.PersonalInformation?.linkedinLink || "",
        dateOfBirth: parsedData.PersonalInformation?.dateOfBirth || "",
        location: parsedData.PersonalInformation?.location || "India",
      },
      professionalDetails: {
        noOfYearsExperience:
          Number(parsedData.ProfessionalDetails?.noOfYearsExperience) || 1,
        currentCompany: parsedData.ProfessionalDetails?.currentCompany || "",
        currentDesignation:
          parsedData.ProfessionalDetails?.currentDesignation || "",
        salary: parsedData.ProfessionalDetails?.salary || "",
        about: parsedData.ProfessionalDetails?.about || "",
        hasConsultingBackground:
          parsedData.ProfessionalDetails?.hasConsultingBackground || false,
      },
      educationDetails:  (parsedData.EducationDetails || []).map((edu) => ({
        ...edu,
        yearOfPassout: extractYear(edu.yearOfPassout),
      })),
      workExperience: parsedData.WorkExperience || [],
      skills: detectedSkills.length > 0 ? detectedSkills : ["Not Mentioned"],
      topCompanies: isTopCompany,
      topInstitutes: isTopInstitute,
      companiesWorkedAt: parsedData.OtherDetails?.companiesWorkedAt || [],
      jobRoles: parsedData.OtherDetails?.jobRoles || [],
      cvUrl: req.body.cvurl || "",
        }
      );
      console.log(`Updated existing resume for email: ${email}`);
    } else {
      // Create new record
      await ResumePool.create({
        personalInformation: {
        name: parsedData.PersonalInformation?.name || "",
        email: parsedData.PersonalInformation?.email || "",
        contactNumber: parsedData.PersonalInformation?.contactNumber || "",
        linkedinLink: parsedData.PersonalInformation?.linkedinLink || "",
        dateOfBirth: parsedData.PersonalInformation?.dateOfBirth || "",
        location: parsedData.PersonalInformation?.location || "India",
      },
      professionalDetails: {
        noOfYearsExperience:
          Number(parsedData.ProfessionalDetails?.noOfYearsExperience) || 1,
        currentCompany: parsedData.ProfessionalDetails?.currentCompany || "",
        currentDesignation:
          parsedData.ProfessionalDetails?.currentDesignation || "",
        salary: parsedData.ProfessionalDetails?.salary || "",
        about: parsedData.ProfessionalDetails?.about || "",
        hasConsultingBackground:
          parsedData.ProfessionalDetails?.hasConsultingBackground || false,
      },
      educationDetails:  (parsedData.EducationDetails || []).map((edu) => ({
        ...edu,
        yearOfPassout: extractYear(edu.yearOfPassout),
      })),
      workExperience: parsedData.WorkExperience || [],
      skills: detectedSkills.length > 0 ? detectedSkills : ["Not Mentioned"],
      topCompanies: isTopCompany,
      topInstitutes: isTopInstitute,
      companiesWorkedAt: parsedData.OtherDetails?.companiesWorkedAt || [],
      jobRoles: parsedData.OtherDetails?.jobRoles || [],
      cvUrl: req.body.cvurl || "",
      });
      console.log(`Created new resume for email: ${email}`);
    }
  }


    res.status(200).json({ success: true, data: parsedData });
  } catch (error) {
    console.error(
      "Error processing resume:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: true,
      message: error.response?.data || "Failed to parse resume",
    });
  }
};

// Define the list of relevant skills

export const resumepool = async (req, res) => {
  try {
    console.log("Received request to parse resume.");

    if (!req.file) {
      console.log("No file uploaded.");
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    console.log("File uploaded successfully, starting PDF parsing...");
    const pdfData = await pdfParse(req.file.buffer);
    console.log("PDF parsed successfully.");

    const resumeText = pdfData.text.trim();
    console.log("Extracted text length:", resumeText.length);

    if (!resumeText) {
      console.log("Extracted text is empty.");
      return res
        .status(400)
        .json({ success: false, message: "Empty resume text" });
    }

    console.log("Sending text to Gemini API...");

    // Send text to Gemini API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Extract structured information from this resume and return JSON with fields: 
                  name, email, noOfYearsExperience, location, companies worked at, and job roles. 
                  Additionally, provide a "rating" (out of 5) based on resume quality, skills, and experience.
                  
                  Criteria for rating:
                  - 5.0: Highly experienced (10+ years), strong skillset, worked at top companies.
                  - 4.0-4.9: Mid-senior level (5-9 years), good skillset, well-written resume.
                  - 3.0-3.9: Moderate experience (3-5 years), lacks strong companies or formatting.
                  - 2.0-2.9: Entry-level (1-2 years), missing important details.
                  - 1.0-1.9: Very basic or poorly formatted resume.

                  Resume Content:
                  ${resumeText}`,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Received response from Gemini API.");

    const rawText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Raw extracted text:", rawText);

    // Remove Markdown (```json ... ```) and extract pure JSON
    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    const cleanJsonText = jsonMatch ? jsonMatch[1].trim() : rawText.trim();

    try {
      let parsedData = JSON.parse(cleanJsonText);
      console.log("Parsed JSON data successfully.");

      // Extract skills that match the predefined list
      const detectedSkills = skillsList.filter((skill) =>
        new RegExp(`\\b${skill}\\b`, "i").test(resumeText)
      );

      // Ensure all required fields exist in the response
      const defaultFields = {
        name: "",
        email: "",
        noOfYearsExperience: "",
        location: "",
        companiesWorkedAt: [], // List of past companies
        skills: detectedSkills.length > 0 ? detectedSkills : ["Not Mentioned"], // Extracted skills
        jobRoles: [],
        rating: 3,
      };

      parsedData = { ...defaultFields, ...parsedData };

      const resume = await ResumePool.create({
        name: parsedData.name,
        email: parsedData.email,
        cvUrl: req.body.cvurl || "",
        location: parsedData.location,
        experience: parsedData.noOfYearsExperience,
        skills: parsedData.skills,
        companies: parsedData.companiesWorkedAt,
        rating: parsedData.rating,
        jobRoles: parsedData.jobRoles,
      });

      res.status(200).json({ success: true, data: parsedData });
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      res.status(500).json({
        success: false,
        message: "Failed to parse response from Gemini API.",
        rawText,
      });
    }
  } catch (error) {
    console.error(
      "Error processing resume:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: error.response?.data || "Failed to parse resume",
    });
  }
};

const convertToBoolean = (value) => value === "true" || value === true;
const calculateExperience = (dateRange) => {
  if (!dateRange || !dateRange.includes(" - ")) return 0;
  const [start, end] = dateRange.split(" - ").map((d) => d.trim());
  const startDate = new Date(`1 ${start}`);
  const endDate = end.toLowerCase().includes("present")
    ? new Date()
    : new Date(`1 ${end}`);
  if (isNaN(startDate) || isNaN(endDate)) return 0;
  return Math.max(
    0,
    ((endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
  );
};

export const AIana = async (req, res, next) => {
  try {
    const { recruiterQuery } = req.body;

    // Define available filters
    const filterSchema = {
      location: "string",
      exp: "number",
      currentCompany: "string",
      isConsultant: "boolean",
      instituteName: "string",
      yearOfPassout: "number",
      workExpCompany: "string",
      minWorkExp: "number",
      skills: "array",
      topCompany: "boolean",
      topInstitutes: "boolean",
      companiesWorkedAt: "array",
      jobRoles: "array",
    };

    // Send text to Gemini API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze the following recruiter query and extract filter values based on this schema: ${JSON.stringify(
                  filterSchema
                )}. 
      Query: "${recruiterQuery}"
      ### Important Conditions:
1. If the recruiter explicitly mentions a candidate must have worked at a **specific company for a certain number of years**, store the company name in "workExpCompany" and the duration in "minWorkExp".
2. If the recruiter **only mentions companies without specifying experience duration**, store them in "companiesWorkedAt" and use "exp" as the general experience requirement.
3. Ensure that:
   - Experience ("exp") is a number representing years of experience.
   - Skills should be an array of relevant technologies.
   - Location should match one of the existing database locations.
   - Job roles should match predefined categories.
   - If the recruiter is looking for top companies or institutes, set the respective boolean flags.

Return the response **strictly as JSON** without any additional text`,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract response text
    const rawText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse response
    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    const cleanJsonText = jsonMatch ? jsonMatch[1].trim() : rawText.trim();
    const filters = JSON.parse(cleanJsonText);
    console.log("Parsed JSON data successfully.", filters);

    res.status(200).json({
      success: true,
      filters: filters,
    });
  } catch (error) {
    next(error);
  }
};

export const filterResumesByPrompt = async (req, res) => {
  try {
    const { recruiterPrompt, cdnUrls } = req.body;

    if (
      !recruiterPrompt ||
      !Array.isArray(cdnUrls) ||
      cdnUrls.length === 0 ||
      !cdnUrls[0].cdnUrl ||
      !cdnUrls[0].userId
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input format: recruiterPrompt and cdnUrls (with userId & cdnUrl) are required.",
      });
    }

    console.log(`Received ${cdnUrls.length} resumes for filtering...`);

    // Step 1: Download and parse all resumes
    const parsedResumes = await Promise.all(
      cdnUrls.map(async ({ userId, cdnUrl }) => {
        try {
          const fileResponse = await axios.get(cdnUrl, {
            responseType: "arraybuffer",
          });
          const pdfData = await pdfParse(fileResponse.data);
          return {
            userId,
            cdnUrl,
            text: pdfData.text.trim().slice(0, 20000),
          };
        } catch (err) {
          console.error(`Failed to process resume: ${cdnUrl}`, err.message);
          return null;
        }
      })
    );

    const validResumes = parsedResumes.filter(Boolean);
    console.log(`Parsed ${validResumes.length} valid resumes.`);

    // Step 2: Ask Gemini to evaluate all resumes
    const promptText = `
You are an expert recruiter assistant. Based on the following recruiter prompt:

"${recruiterPrompt}"

Select the best matching resumes from the list below. Return a JSON array of the **userId and cdnUrl** of the best matching resumes, in this format:

[
  { "userId": "user123", "cdnUrl": "https://cdn.com/resume1.pdf" },
  ...
]

Resumes:
[
${validResumes
  .map(
    (resume) => `{
  "userId": "${resume.userId}",
  "cdnUrl": "${resume.cdnUrl}",
  "text": "${resume.text.replace(/\n/g, " ").slice(0, 5000)}"
}`
  )
  .join(",\n")}
]

Respond with only the JSON array, no extra commentary.
`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: promptText }],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const rawText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    const cleanJsonText = jsonMatch ? jsonMatch[1].trim() : rawText.trim();
    const matchedCandidates = JSON.parse(cleanJsonText);

    return res.status(200).json({
      success: true,
      matchedCandidates, // includes both userId and cdnUrl
    });
  } catch (err) {
    console.error("Error filtering resumes:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to filter resumes based on recruiter prompt.",
    });
  }
};

  export const uploadAndShortlist = async (req, res, next) => {
    try {
      const { recruiterQuery } = req.body;

      if (!recruiterQuery) {
        return res.status(400).json({ error: "Recruiter query missing" });
      }

      // 1. Fetch all user data
      const users = await ResumePool.find().lean();
      console.log("Fetched", users.length, "users");

      const csvUrl = await uploadJsonAsCsvToS3(users, "resumes/csv");
      console.log("CSV uploaded to S3 at", csvUrl);

      // 2. Build a prompt that asks for cvUrl values
    const prompt = `
    You are an intelligent assistant helping a recruiter identify the most relevant candidates from a CSV file.
    
    The CSV contains a list of user profiles. Each profile includes a field called "cvUrl" which is a downloadable link to the candidate's resume. Other fields include name, experience, education, skills, companies, and roles. You will be provided a public URL to this CSV file.
    
    Recruiter's Query:
    ${recruiterQuery}
    
    CSV File URL:
    ${csvUrl}
    
    Instructions:
    1. Download and parse the CSV file.
    2. Analyze the profiles based on the recruiter's query.
    3. Select only the most relevant candidates that match the query criteria.
    4. Return ONLY a JSON array containing the "cvUrl" values of the shortlisted candidates.
    5. Do NOT include any explanation, text, or metadata.
    
    Expected Response Format:
    \`\`\`json
    ["https://s3.amazonaws.com/path-to-resume1.pdf", "https://s3.amazonaws.com/path-to-resume2.pdf"]
    \`\`\`
    
    Only return the JSON array as shown above.
    `;
    
        // 4. Call Gemini
        const geminiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          { contents: [{ role: "user", parts: [{ text: prompt }] }] },
          { headers: { "Content-Type": "application/json" } }
        );
    
        const rawText =
          geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
        // 5. Extract the JSON array from the fenced code block
        const match = rawText.match(/```json\n([\s\S]*?)\n```/);
        const cvUrls = match ? JSON.parse(match[1]) : [];
    
        // 6. Return the result
        return res.status(200).json({
          success: true,
          rawText: rawText,
          shortlistedCvUrls: cvUrls,
          totalShortlisted: cvUrls.length,
        });
      } catch (err) {
        console.error("Error in uploadAndShortlist:", err.response?.data || err);
        return res.status(500).json({
          success: "failed",
          message: err.message || err.toString(),
        });
      }
    };





//JD to requirement and qualification
export const analyseJobDescription = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input: jobDescription (string) is required.",
      });
    }

    // Allowed degrees for qualifications
    const allowedDegrees = [
      "Bachelors (any)",
      "Bachelors engineering",
      "PG any",
      "PG engineering",
      "MBA",
      "CA",
      "MBBS",
      "CFA",
      "PhD",
    ];

    // Build the HR-style prompt with degree filter
    const prompt = `
    You are a highly experienced HR specialist. Given this job description:
    
    """${jobDescription.trim()}"""
    
    And the pool of allowed educational credentials:
    ${allowedDegrees.map(d => `- ${d}`).join("\n")}
    
    **Qualifications Extraction Rules**  
    1. From that allowed list, select only the credentials that logically fit the role described above.  
    2. If “MBA” is chosen, still mention a Bachelor’s (“Candidate should have completed a Bachelor’s degree in a relevant field”), but do not list “Bachelors (any)” separately.  
    3. Only include “Bachelors engineering” or “PG engineering” if the JD explicitly requires an engineering or technical background.  
    4. Do **not** include “PhD,” “MBBS,” “CA,” or “CFA” unless the JD clearly demands research/medical/finance specialization.  
    5. Rewrite each selected credential as a full, professional sentence (e.g. “Candidate should hold an MBA to support strategic leadership.”).
    
    **Requirements Extraction Rules**  
    Extract each core skill, experience, or attribute from the JD and rewrite it as a professional sentence (e.g. “Candidate must have 5+ years of experience in…”).

    **Screening Questions Rules**  
    Based on the JD, craft **3–5** short, clear screening questions that you would ask a candidate to quickly gauge fit. Each question should be tailored to the key skills or experiences (e.g. “Can you describe a time you led a strategic initiative under ambiguity?”).

    
    **Output Format**  
    Respond with **only** this JSON structure:
    
    {
      "qualifications": [
        /* array of full-sentence qualifications, using only allowed credentials */
      ],
      "requirements": [
        /* array of full-sentence requirements */
      ],
      "screeningQuestions": [
       /* array of 3–5 screening questions as strings */
      ]
    }
    
    —no extra commentary, no bullet lists outside the JSON, just the JSON object.  
    `;
    
    // Call Gemini
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const raw = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonText = raw.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(jsonText);

    return res.status(200).json({
      success: true,
      qualifications: parsed.qualifications,
      requirements: parsed.requirements,
      screeningQuestions: parsed.screeningQuestions,
    });
  } catch (err) {
    console.error("Error in analyseJobDescription:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to analyse job description.",
    });
  }
};

let skillEmbeddingsData = null; // Cache for loaded embeddings

const loadSkillEmbeddings = async () => {
    if (skillEmbeddingsData) {
        return skillEmbeddingsData; // Return cached data if already loaded
    }
    // Using __dirname is safer than relative paths like './'
    // Ensure the path correctly points to where you saved skill_embeddings.json
    // Example: If AiController.js is in server/controllers, this assumes
    // skill_embeddings.json is also directly in server/controllers.
    const embeddingsFilePath = path.join(__dirname, 'skill_embeddings_gemini.json');
    // OR if it's in the server root: const embeddingsFilePath = path.join(__dirname, '../../skill_embeddings.json');

    try {
        console.log(`Loading skill embeddings from ${embeddingsFilePath}...`);
        // CORRECTED: Pass 'utf8' as the second argument
        const data = await fs.readFile(embeddingsFilePath, { encoding: 'utf8' });
        skillEmbeddingsData = JSON.parse(data);
        console.log(`Loaded ${skillEmbeddingsData.length} skill embeddings.`);
        return skillEmbeddingsData;
    } catch (error) {
        console.error(`Error loading skill embeddings file ${embeddingsFilePath}:`, error);
        // Log more specific error if possible, e.g., file not found
        if (error.code === 'ENOENT') {
            console.error(`File not found: ${embeddingsFilePath}`);
        }
        skillEmbeddingsData = []; // Set to empty array on error to prevent repeated attempts
        return []; // Return empty array on error
    }
};
// --- End Skill Embedding Loading ---


// --- Helper function for Cosine Similarity ---
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must be of the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0; // Avoid division by zero
  }

  return dotProduct / (normA * normB);
}
// --- End Cosine Similarity Helper ---


// Optimized AI-Based Resume Filtering - Single Prompt, No Skill Matching
export const analyseIdealCandidate = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    // Input validation
    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input: 'jobDescription' (string) is required."
      });
    }

    // Single comprehensive prompt for both filtering and candidate ranking
    const comprehensivePrompt = `
You are an expert recruitment AI. Analyze the job description and provide structured filtering criteria AND rank candidates from our database in a single response.

JOB DESCRIPTION:
"""${jobDescription.trim()}"""

TASK 1 - Extract filtering criteria as JSON:
{
  "minimumYearsExperience": number | null,
  "isTopCompaniesRequired": boolean,
  "isTopInstitutesRequired": boolean,
  "requiresConsultingBackground": boolean,
  "requiredLocation": string | null,
  "requiredCompanies": string[],
  "requiredInstitutes": string[],
  "jobLevel": "entry" | "mid" | "senior" | "executive",
  "industryPreference": string | null,
  "functionalArea": string | null
}

TASK 2 - Generate optimized search query for candidate database:
Provide a search query string that can be used with Elasticsearch/database search to find matching candidates. Focus on keywords, titles, and critical requirements.

TASK 3 - Provide ranking criteria:
List the top 5 factors in order of importance for ranking candidates for this role.

FORMAT YOUR RESPONSE AS:
FILTERS: [JSON object from Task 1]
SEARCH_QUERY: [Search query string from Task 2]  
RANKING_CRITERIA: [Numbered list from Task 3]
    `;

    let parsedResponse = null;
    let searchQuery = "";
    let rankingCriteria = [];

    try {
      // Single API call to Gemini
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        { 
          contents: [{ 
            role: "user", 
            parts: [{ text: comprehensivePrompt }] 
          }] 
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const rawResponse = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Parse the structured response
      const filtersMatch = rawResponse.match(/FILTERS:\s*({[^}]*})/s);
      const searchQueryMatch = rawResponse.match(/SEARCH_QUERY:\s*([^\n]+)/);
      const rankingMatch = rawResponse.match(/RANKING_CRITERIA:\s*([\s\S]*?)(?=\n\n|$)/);

      if (filtersMatch) {
        parsedResponse = JSON.parse(filtersMatch[1]);
      }
      
      if (searchQueryMatch) {
        searchQuery = searchQueryMatch[1].trim();
      }
      
      if (rankingMatch) {
        rankingCriteria = rankingMatch[1].trim().split('\n').filter(line => line.trim());
      }

    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError.message);
      // Fallback to default values
      parsedResponse = {
        minimumYearsExperience: null,
        isTopCompaniesRequired: false,
        isTopInstitutesRequired: false,
        requiresConsultingBackground: false,
        requiredLocation: null,
        requiredCompanies: [],
        requiredInstitutes: [],
        jobLevel: "mid",
        industryPreference: null,
        functionalArea: null
      };
      searchQuery = jobDescription.slice(0, 100); // Fallback search
    }

    // Optimized candidate filtering and ranking
    let recommendedCandidates = [];
    try {
      recommendedCandidates = await optimizedCandidateSearch(parsedResponse, searchQuery, rankingCriteria);
    } catch (searchError) {
      console.error("Error during candidate search:", searchError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to search candidates.",
        error: searchError.message
      });
    }

    // Return comprehensive results
    return res.status(200).json({
      success: true,
      filters: parsedResponse,
      searchQuery: searchQuery,
      rankingCriteria: rankingCriteria,
      totalCandidates: recommendedCandidates.length,
      recommendedCandidates: recommendedCandidates.slice(0, 50), // Limit to top 50
      processingTime: Date.now() - req.startTime // Add timing if needed
    });

  } catch (err) {
    console.error("Unexpected error in analyseIdealCandidate:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to analyse job description.",
      error: err.message
    });
  }
};

// Optimized candidate search function
async function optimizedCandidateSearch(filters, searchQuery, rankingCriteria) {
  try {
    // Build Elasticsearch query for optimal performance
    const esQuery = {
      index: 'candidates',
      body: {
        query: {
          bool: {
            must: [
              // Full-text search on resume content
              {
                multi_match: {
                  query: searchQuery,
                  fields: [
                    'resume_text^3',      // Higher boost for resume content
                    'job_titles^2',       // Medium boost for job titles
                    'skills',             // Standard boost for skills
                    'company_names',
                    'education'
                  ],
                  type: 'best_fields',
                  fuzziness: 'AUTO'
                }
              }
            ],
            filter: buildElasticsearchFilters(filters),
            should: buildBoostingQueries(filters, rankingCriteria)
          }
        },
        sort: [
          { _score: { order: 'desc' } },
          { last_active: { order: 'desc' } },
          { profile_completeness: { order: 'desc' } }
        ],
        size: 100, // Fetch top 100 candidates
        _source: {
          includes: [
            'id', 'name', 'email', 'phone', 'current_role', 
            'total_experience', 'current_company', 'location',
            'key_skills', 'education', 'last_active', 'match_score'
          ]
        }
      }
    };

    // Execute search (pseudo-code - replace with your ES client)
    const searchResults = await elasticsearchClient.search(esQuery);
    
    // Process and score results
    const processedCandidates = searchResults.body.hits.hits.map(hit => {
      const candidate = hit._source;
      const matchScore = calculateAdvancedMatchScore(candidate, filters, rankingCriteria);
      
      return {
        ...candidate,
        relevanceScore: hit._score,
        matchScore: matchScore,
        combinedScore: (hit._score * 0.6) + (matchScore * 0.4)
      };
    });

    // Sort by combined score
    return processedCandidates.sort((a, b) => b.combinedScore - a.combinedScore);

  } catch (error) {
    console.error("Error in optimized candidate search:", error);
    throw error;
  }
}

// Build Elasticsearch filters for precise matching
function buildElasticsearchFilters(filters) {
  const esFilters = [];

  // Experience filter
  if (filters.minimumYearsExperience !== null) {
    esFilters.push({
      range: {
        total_experience: {
          gte: filters.minimumYearsExperience
        }
      }
    });
  }

  // Location filter
  if (filters.requiredLocation) {
    esFilters.push({
      match: {
        location: {
          query: filters.requiredLocation,
          fuzziness: 'AUTO'
        }
      }
    });
  }

  // Specific companies filter
  if (filters.requiredCompanies && filters.requiredCompanies.length > 0) {
    esFilters.push({
      terms: {
        'company_names.keyword': filters.requiredCompanies
      }
    });
  }

  // Specific institutes filter
  if (filters.requiredInstitutes && filters.requiredInstitutes.length > 0) {
    esFilters.push({
      terms: {
        'education_institutes.keyword': filters.requiredInstitutes
      }
    });
  }

  // Job level filter
  if (filters.jobLevel) {
    esFilters.push({
      match: {
        seniority_level: filters.jobLevel
      }
    });
  }

  return esFilters;
}

// Build boosting queries for better ranking
function buildBoostingQueries(filters, rankingCriteria) {
  const boostQueries = [];

  // Boost top companies if required
  if (filters.isTopCompaniesRequired) {
    boostQueries.push({
      match: {
        is_top_tier_company: true
      },
      boost: 2.0
    });
  }

  // Boost top institutes if required
  if (filters.isTopInstitutesRequired) {
    boostQueries.push({
      match: {
        is_top_tier_institute: true
      },
      boost: 1.8
    });
  }

  // Boost consulting background if required
  if (filters.requiresConsultingBackground) {
    boostQueries.push({
      match: {
        has_consulting_background: true
      },
      boost: 1.5
    });
  }

  // Boost recently active candidates
  boostQueries.push({
    range: {
      last_active: {
        gte: 'now-30d'
      }
    },
    boost: 1.3
  });

  return boostQueries;
}

// Calculate advanced match score
function calculateAdvancedMatchScore(candidate, filters, rankingCriteria) {
  let score = 0;
  let maxScore = 100;

  // Experience match (25 points)
  if (filters.minimumYearsExperience !== null) {
    const expDiff = candidate.total_experience - filters.minimumYearsExperience;
    if (expDiff >= 0) {
      score += Math.min(25, 15 + (expDiff * 2)); // Bonus for extra experience
    }
  } else {
    score += 20; // Default if no requirement
  }

  // Location match (20 points)
  if (filters.requiredLocation) {
    if (candidate.location && 
        candidate.location.toLowerCase().includes(filters.requiredLocation.toLowerCase())) {
      score += 20;
    }
  } else {
    score += 15;
  }

  // Company prestige (20 points)
  if (filters.isTopCompaniesRequired && candidate.is_top_tier_company) {
    score += 20;
  } else if (!filters.isTopCompaniesRequired) {
    score += 15;
  }

  // Education prestige (15 points)
  if (filters.isTopInstitutesRequired && candidate.is_top_tier_institute) {
    score += 15;
  } else if (!filters.isTopInstitutesRequired) {
    score += 12;
  }

  // Profile activity and completeness (20 points)
  const daysSinceActive = Math.floor((Date.now() - new Date(candidate.last_active)) / (1000 * 60 * 60 * 24));
  if (daysSinceActive <= 7) score += 20;
  else if (daysSinceActive <= 30) score += 15;
  else if (daysSinceActive <= 90) score += 10;
  else score += 5;

  return Math.min(score, maxScore);
}

// Caching layer for frequent searches
const searchCache = new Map();
const CACHE_TTL = 300000; // 5 minutes

function getCachedResult(key) {
  const cached = searchCache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedResult(key, data) {
  searchCache.set(key, {
    data: data,
    timestamp: Date.now()
  });
  
  // Clean old cache entries
  if (searchCache.size > 1000) {
    const oldestKey = searchCache.keys().next().value;
    searchCache.delete(oldestKey);
  }
}