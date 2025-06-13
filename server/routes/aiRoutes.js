import express from "express";
import multer from "multer";
import { parseResume,resumepool,AIana, filterResumesByPrompt,uploadAndShortlist,analyseJobDescription, analyseIdealCandidate, ask } from "../controllers/AiController.js";


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/resume-parser", upload.single("resume"), parseResume);

router.post("/resume-pool", upload.single("resume"), resumepool);

router.post("/AI-analyser", AIana);

router.post("/filter-resume", filterResumesByPrompt)

router.post("/filter-resume", filterResumesByPrompt)

router.post("/upload-resume", uploadAndShortlist)

router.post("/analyse-jd", analyseJobDescription)

router.post("/shortlisting", analyseIdealCandidate)

router.post("/ask", ask)

export default router;
