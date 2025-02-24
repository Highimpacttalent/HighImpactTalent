import express from "express";
import multer from "multer";
import { parseResume } from "../controllers/AiController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/resume-parser", upload.single("resume"), parseResume);

export default router;
