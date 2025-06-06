import express from "express";
import authRoute from "./google-linkedin-authRoutes.js"; 
import userRoute from "./userRoutes.js";
import companyRoute from "./companiesRoutes.js";
import jobRoute from "./jobsRoutes.js";
import applicationRoute from "./applicationRoutes.js";
import blogRoute from './blogRoutes.js'
import sendMailRoute from "./sendMailRoutes.js";
import aiRoutes from "./aiRoutes.js";
import resumepool from "./resumepool.js"
import paymentRoute from "./paymentRoutes.js"
import verifyRoute from "./verifyToken.js";

const router = express.Router();

const path = "/api-v1/";


router.use(`${path}auth`, authRoute); 
router.use(`${path}user`, userRoute);
router.use(`${path}companies`, companyRoute);
router.use(`${path}jobs`, jobRoute);
router.use(`${path}application`, applicationRoute);
router.use(`${path}blog`, blogRoute);
router.use(`${path}sendmail`, sendMailRoute);
router.use(`${path}ai`, aiRoutes);
router.use(`${path}resume`, resumepool);
router.use(`${path}payment`, paymentRoute);
router.use(`${path}verify`, verifyRoute);


export default router;