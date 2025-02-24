import pdfParse from "pdf-parse";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = "AIzaSyChz49v4j96SIOqL3_kAbWi6RJgTyuzIfI";

export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    // Send text to Gemini 1.5 Flash API for parsing
    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `Extract structured information from this resume:\n\n${resumeText}\n\nProvide details in JSON format with fields: name, email, phone, skills, experience, education.`,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json", Authorization: `Bearer ${GEMINI_API_KEY}` } }
    );

    const parsedData = geminiResponse.data;

    res.status(200).json({
      success: true,
      parsedData,
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ success: false, message: "Failed to parse resume" });
  }
};
