import express from "express";
import { getResumeById, getResumes } from "../controllers/resumepool.js";

const router = express.Router();

router.post("/getResume", getResumes);
router.post("/getResumeId",getResumeById)

export default router;
