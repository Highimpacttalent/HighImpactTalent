import express from "express";
import { googleAuth,linkedinAuth } from "../controllers/google-linkedin-authController.js";

const router = express.Router();

// Google Auth Route
router.post('/google', googleAuth);
router.post('/linkedin', linkedinAuth);

export default router;