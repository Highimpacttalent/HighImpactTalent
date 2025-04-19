import pdfParse from "pdf-parse/lib/pdf-parse.js";
import axios from "axios";
import { skillsList } from "./mock.js";
import ResumePool from "../models/ResumePool.js";
import { topCompanieslist, topInstituteslist } from "./mock.js";

const GEMINI_API_KEY = "AIzaSyCILU-_ezGfu3iojbS-hFe9-Fil4klNOlo";

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

    // Store in MongoDB
    const resume = await ResumePool.create({
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
      educationDetails: parsedData.EducationDetails || [],
      workExperience: parsedData.WorkExperience || [],
      skills: detectedSkills.length > 0 ? detectedSkills : ["Not Mentioned"],
      topCompanies: isTopCompany,
      topInstitutes: isTopInstitute,
      companiesWorkedAt: parsedData.OtherDetails?.companiesWorkedAt || [],
      jobRoles: parsedData.OtherDetails?.jobRoles || [],
      cvUrl: req.body.cvurl || "",
    });

    res.status(200).json({ success: true, data: parsedData });
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