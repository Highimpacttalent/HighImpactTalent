import express from "express";
import { createOrUpdateMasterResume, getMasterResumeByUserId, createAiTailoredResume } from "../controllers/MasterResume.js";

const router = express.Router();

// POST JOB
router.post("/create", createOrUpdateMasterResume);

// GET BY ID
router.post("/fetch-id", getMasterResumeByUserId);

//AI-Resume Maker
router.post("/ai-tailored-resume", createAiTailoredResume);

export default router;

