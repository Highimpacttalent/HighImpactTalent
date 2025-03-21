import express from "express";
import { getResumeById, getResumes } from "../controllers/resumepool.js";
import userAuth from "../middlewares/authMiddleware.js";
import { paymentMiddleware } from "../middlewares/paymentMiddleware.js";

const router = express.Router();

router.post("/getResume", userAuth,paymentMiddleware,getResumes);
router.post("/getResumeId",userAuth,paymentMiddleware,getResumeById)

export default router;
