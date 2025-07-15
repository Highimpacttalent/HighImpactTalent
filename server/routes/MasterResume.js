import express from "express";
import multer from 'multer';

import { createOrUpdateMasterResume, getMasterResumeByUserId, createAiTailoredResume, analyzeResumeFile } from "../controllers/MasterResume.js";
const storage = multer.memoryStorage(); // or use diskStorage if saving to disk
const upload = multer({ storage });
const router = express.Router();

// POST JOB
router.post("/create", createOrUpdateMasterResume);

// GET BY ID
router.post("/fetch-id", getMasterResumeByUserId);

//AI-Resume Maker
router.post("/ai-tailored-resume", createAiTailoredResume);

//Resume Parser
router.post('/analyze-upload', upload.single('resumeFile'), analyzeResumeFile);

export default router;

