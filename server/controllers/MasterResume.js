import MasterResume from "../models/MasterResume.js";
import mongoose from "mongoose";
import axios from "axios";
import fs from "fs";
import path from "path";
import { generateResumeHTML } from "../utils/MasterResume.js";
const GEMINI_API_KEY = "AIzaSyCXj7iUCYWDQXPW3i6ky4Y24beLiINeDBw";
import { uploadFileToS3 } from "../s3Config/s3.js";
import puppeteer from 'puppeteer-core'; // Import puppeteer-core
import chromium from '@sparticuz/chromium'; 

// Helper to split comma-separated skills string into an array
const parseSkillsString = (skillsString) => {
  if (!skillsString) return [];
  // Split by comma, trim whitespace, and filter out empty strings
  return skillsString
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
};

export const createOrUpdateMasterResume = async (req, res) => {
  try {
    const {
      user_id, // Expect user_id here
      personalInfo,
      careerSummary,
      education,
      workExperience,
      skills, // This is the single string from the form
      achievements,
      volunteer,
    } = req.body;

    // Basic validation for user_id presence
    if (!user_id) {
      return res
        .status(400)
        .json({ message: "User ID is required in the request body" });
    }

    // Basic validation for user_id format
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Map the incoming form data structure keys to the schema structure keys
    // Ensure nested objects exist even if empty, to avoid Mongoose issues with undefined paths on $set
    const mappedData = {
      personalInfo: personalInfo || {}, // Map and ensure it's an object
      careerSummary: {
        // Map from careerSummary and add placeholder for others
        shortSummary: careerSummary?.shortSummary,
        detailedObjective: careerSummary?.detailedObjective,
      },
      education: education || [], // Map 'education' array to 'educationDetails' and ensure it's an array
      workExperience: workExperience || [], 
      skills: parseSkillsString(skills), // Convert comma-separated string to array
      achievements: achievements || [], 
      volunteer: volunteer || [], // Direct map and ensure it's an array
    };

    // Find an existing resume for the user_id or create a new one (upsert)
    const resume = await MasterResume.findOneAndUpdate(
      { user_id: user_id },
      { $set: mappedData },
      {
        new: true, // Return the updated/created document
        upsert: true, // Create the document if it doesn't exist
        runValidators: true,
      }
    );

    // Determine if a new document was created vs. an existing one updated
    // Check if createdAt and updatedAt are the same time (upserted document will have identical timestamps initially)
    const status =
      resume.createdAt.getTime() === resume.updatedAt.getTime() ? 201 : 200;
    const message =
      status === 201
        ? "Master Resume created successfully"
        : "Master Resume updated successfully";

    res.status(status).json({ message: message, resume: resume });
  } catch (error) {
    console.error("Error saving/updating master resume:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }

    // Handle Mongoose duplicate key errors (e.g., unique: true constraints)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]; // Get the field name causing the duplicate
      // Provide a specific message if the duplicate is on the user_id field (unique constraint)
      if (field === "user_id") {
        // Although upsert handles this, this catch might trigger if upsert fails for some other reason
        // or if unique is applied elsewhere like email *across* all resumes instead of per user
        return res.status(400).json({
          message: `A master resume profile already exists for this user.`,
          field: field,
        });
      }
      // Handle other potential unique fields if needed (like email if unique constraint is applied to it)
      const value = error.keyValue[field]; // Get the duplicate value
      return res.status(400).json({
        message: `Duplicate value found for field '${field}': '${value}'. Please use a different value.`,
        field: field,
      });
    }

    // Handle other potential errors
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getMasterResumeByUserId = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate the user_id format before querying
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Find the resume by user_id
    const resume = await MasterResume.findOne({ user_id: userId });

    // If no resume is found for this user ID
    if (!resume) {
      return res
        .status(404)
        .json({ message: "Master Resume not found for this user ID" });
    }

    // Return the found resume
    res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching master resume:", error);

    // Handle Mongoose CastError specifically (e.g., if the provided ID format is invalid)
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid User ID format" });
    }
    // Handle other potential errors
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createAiTailoredResume = async (req, res) => {
  try {
    const { user_id, jobDescription } = req.body;

    // Validate presence
    if (!user_id || !jobDescription) {
      return res.status(400).json({
        error: "user_id and jobDescription are required",
      });
    }

    // Validate format
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Invalid user_id format" });
    }

    // Fetch master resume from DB
    const masterResume = await MasterResume.findOne({ user_id }).lean();
    if (!masterResume) {
      return res.status(404).json({ error: "Master resume not found for this user" });
    }

    // Format prompt: Tailored resume generation
    const prompt = `
You are a highly skilled AI resume writer.

Below is the user's **Master Resume** in structured JSON format. Following that, a **Job Description** is provided. Your task is to:

1. Extract the most relevant experiences, skills, and accomplishments.
2. Tailor the language to match the job requirements.
3. Use strong action verbs and quantifiable impact statements.
4. Rewrite it in the exact same schema format as the original resume input, so it can be stored directly in the database.

⚠️ IMPORTANT:
- Do not skip any fields present in the original JSON.
- Use the most optimized phrasing and keyword alignment for the job description.
- Keep fields like \`storedResumes\`, \`_id\`, \`__v\`, \`createdAt\`, \`updatedAt\` untouched unless overwritten by new optimized data.
- Your response **must be** a clean JSON object, wrapped inside \`\`\`json\n...\n\`\`\`.

---

📄 Master Resume:
\`\`\`json
${JSON.stringify(masterResume, null, 2)}
\`\`\`

🧾 Job Description:
\`\`\`
${jobDescription}
\`\`\`

🧠 Instructions Recap:
- Reword experience and achievements using impactful and relevant language.
- Optimize every section for the job.
- Return ONLY a valid JSON object. No extra commentary.

✅ Expected Output Format:
\`\`\`json
{ ...tailoredResumeObject }
\`\`\`
`;

    // Call Gemini API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract raw Gemini text
    const rawText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract the JSON object from the response (inside ```json block)
    const match = rawText.match(/```json\s*([\s\S]*?)\s*```/);

    if (!match) {
      return res.status(500).json({
        error: "Failed to parse response from Gemini. No JSON block found.",
        rawText,
      });
    }

    const tailoredResume = JSON.parse(match[1]);
    const html = generateResumeHTML(tailoredResume);

    const browser = await puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless, 
    });

    const page = await browser.newPage();
    // It's often good practice to set a reasonable viewport for PDF generation
    await page.setViewport({ width: 1080, height: 1920 }); // A common standard for documents

    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Crucial for background colors/images to appear
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      }
    });

    await browser.close();

    // Upload PDF to S3
    const filename = `resumes/${Date.now()}-tailored-resume.pdf`;
    const s3Response = await uploadFileToS3(pdfBuffer, filename, "application/pdf");
    const pdfUrl = s3Response.Location;

    const resumeCount = masterResume.storedResumes?.length || 0;
    const newResumeName = `Resume ${resumeCount + 1}`;

    // Update master resume document in DB
    await MasterResume.findOneAndUpdate(
      { user_id },
      {
        $push: {
          storedResumes: {
            resumeName: newResumeName,
            link: pdfUrl,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      tailoredResume,
      pdfUrl  
    });
  } catch (error) {
    console.error("Gemini Resume Generation Error:", error.message);
    return res.status(500).json({
      error: "Failed to generate tailored resume",
      details: error.message,
    });
  }
};
