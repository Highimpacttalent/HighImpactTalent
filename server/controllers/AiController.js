import pdfParse from "pdf-parse/lib/pdf-parse.js";
import axios from "axios";
import { skillsList } from "./mock.js";
import ResumePool from "../models/ResumePool.js";

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
                text: `Extract structured information from this resume and return JSON with fields:
                name, email, contactnumber, noOfYearsExperience, currentCompany, currentDesignation, linkedinLink, about, salary, location, joinConsulting (either 'lateral' or 'out of campus'), dateOfBirth, companies worked at and jobRoles. If any field is missing, return an empty string.

                Additionally, provide a separate JSON object with a "rating" (out of 5) based on resume quality, skills, and experience.

                Criteria for rating:
                - 5.0: Highly experienced (10+ years), strong skillset, worked at top companies.
                - 4.0-4.9: Mid-senior level (5-9 years), good skillset, well-written resume.
                - 3.0-3.9: Moderate experience (3-5 years), lacks strong companies or formatting.
                - 2.0-2.9: Entry-level (1-2 years), missing important details.
                - 1.0-1.9: Very basic or poorly formatted resume.

Resume Content:
${resumeText}` },
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
      return res.status(500).json({ success: false, message: "Invalid API response format" });
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

    // Extract skills based on predefined list
    const detectedSkills = skillsList.filter((skill) =>
      new RegExp(`\\b${skill}\\b`, "i").test(resumeText)
    );

    // Ensure all required fields exist, with defaults
    const defaultFields = {
      name: "",
      email: "",
      contactnumber: "",
      noOfYearsExperience: "",
      currentCompany: "",
      currentDesignation: "",
      linkedinLink: "",
      about: "",
      salary: "",
      location: "",
      joinConsulting: "",
      dateOfBirth: "",
      skills: detectedSkills.length > 0 ? detectedSkills : ["Not Mentioned"],
      rating: parsedData.rating || 0, // Ensure rating is present
      companiesWorkedAt: parsedData.companiesWorkedAt || [],
      jobRoles:[]
    };

    parsedData = { ...defaultFields, ...parsedData };

    // Store in MongoDB
    const resume = await ResumePool.create({
      name: parsedData.name,
      email: parsedData.email,
      cvUrl: req.body.cvurl,
      location: parsedData.location,
      experience: parsedData.noOfYearsExperience,
      skills: parsedData.skills,
      companies: parsedData.companiesWorkedAt, // Ensure it is an array
      rating: parsedData.rating, // Store rating properly
      jobRoles: parsedData.jobRoles
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
        jobRoles:[],
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
        jobRoles: parsedData.jobRoles
      });

      res.status(200).json({ success: true, data: parsedData });
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      res
        .status(500)
        .json({
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
