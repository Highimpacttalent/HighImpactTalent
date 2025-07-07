import express from "express";
import { createOrUpdateMasterResume, getMasterResumeByUserId } from "../controllers/MasterResume.js";

const router = express.Router();

// POST JOB
router.post("/create", createOrUpdateMasterResume);

// GET BY ID
router.get("/fetch-id", getMasterResumeByUserId);

export default router;

