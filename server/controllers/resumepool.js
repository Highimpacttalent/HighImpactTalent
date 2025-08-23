import ResumePool from "../models/ResumePool.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
const generativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const indexName = "gemini-resume-search-full"; 
const pineconeIndex = pinecone.index(indexName);

const generateJsonFromText = async (resumeText, score) => {
    const prompt = `
        You are an expert resume parser. Your task is to analyze the provided raw text from a candidate's resume and convert it into a structured JSON object.
        Adhere strictly to the following JSON format. Do not add any fields that are not in the schema. If information for a field is not available in the text, use null or an empty array [].
        
        **JSON Schema to follow:**
        {
          "retrieval_score": ${score},
          "personal_info": { "name": "string", "location": "string", "contact": { "email": "string", "phone": "string", "linkedin": "string" }},
          "professional_profile": { "current_company": "string", "current_role": "string", "total_experience_stated": "string" },
          "education": [{ "institution": "string", "class_of": "integer" }],
          "work_experience": [{ "company": "string", "role": "string", "duration": "string", "responsibilities": ["string"] }],
          "skills": ["string"],
          "metadata": { "resume_url": "string" }
        }

        **Resume Text to Analyze:**
        ---
        ${resumeText}
        ---

        Now, please generate ONLY the JSON object based on the text provided above. Do not include markdown formatting like \`\`\`json.
    `;

    try {
        const result = await generativeModel.generateContent(prompt);
        const responseText = result.response.text();
        // Clean the response to ensure it's valid JSON before parsing
        const cleanResponse = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanResponse);
    } catch (error) {
        console.error("⚠️ Error generating or parsing JSON for a candidate:", error);
        return {
            error: "Failed to process resume text into JSON.",
            retrieval_score: score,
            original_text: resumeText.substring(0, 200) + '...' // Return a snippet for debugging
        };
    }
};

export const getResumes = async (req, res, next) => {
    try {
        const { job_description, numberOfResumes } = req.body;

        // 1. --- Input Validation ---
        if (!job_description || !job_description.trim()) {
            return res.status(400).json({ success: false, message: "Job description is required." });
        }
        const top_k = Number(numberOfResumes) || 5; // Default to 5 resumes if not provided

        // 2. --- Generate Embedding for the Query ---
        console.log(`🔍 Generating embedding for: "${job_description.substring(0, 50)}..."`);
        const embeddingResult = await embeddingModel.embedContent(job_description);
        const queryEmbedding = embeddingResult.embedding.values;

        if (!queryEmbedding) {
            throw new Error("Failed to generate query embedding.");
        }

        // 3. --- Retrieve Candidates from Pinecone (Retrieval) ---
        console.log(`🔎 Searching Pinecone for top ${top_k} candidates...`);
        const queryResponse = await pineconeIndex.query({
            vector: queryEmbedding,
            topK: top_k,
            includeMetadata: true,
        });

        const matches = queryResponse.matches || [];
        if (matches.length === 0) {
            return res.status(200).json({
                success: true,
                totalResumes: 0,
                data: [],
                message: "No relevant candidates found."
            });
        }
        console.log(`✅ Found ${matches.length} candidates. Formatting responses...`);


        // 4. --- Format Each Candidate using Gemini (Generation) ---
        // We use Promise.all to run the generation for all candidates concurrently for better performance.
        const generationPromises = matches.map(match => {
            const resumeText = match.metadata?.full_text || "";
            const score = match.score || 0;
            if (!resumeText) return null; // Skip if no text is found
            return generateJsonFromText(resumeText, parseFloat(score.toFixed(4)));
        });

        const formattedResumes = (await Promise.all(generationPromises)).filter(Boolean); // Filter out any nulls

        // 5. --- Send Final Response ---
        res.status(200).json({
            success: true,
            totalResumes: formattedResumes.length,
            data: formattedResumes,
        });

    } catch (error) {
        console.error("Error in getResumes RAG controller:", error);
        next(error); 
    }
};

// export const getResumeById = async (req, res, next) => {
//   try {
//     const { resumeId } = req.body;
//     console.log(resumeId)

//     const resume = await ResumePool.findById(resumeId);

//     if (!resume) {
//       return res.status(404).json({
//         success: false,
//         message: "Resume not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: resume,
//     });
//   } catch (error) {
//     next(error);
//   }
// };


