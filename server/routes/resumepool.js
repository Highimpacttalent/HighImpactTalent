import express from "express";
import { getResumes } from "../controllers/resumepool.js";

const router = express.Router();

router.post("/getResume", getResumes);

export default router;
