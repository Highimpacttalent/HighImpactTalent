import express from "express";
import { googleAuth } from "../controllers/google-linkedin-authController.js";

const router = express.Router();

// Google Auth Route
router.post('/google', googleAuth);

export default router;