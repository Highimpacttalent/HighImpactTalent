import express from "express";

// import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import companyRoute from "./companiesRoutes.js";
import jobRoute from "./jobsRoutes.js";
import applicationRoute from "./applicationRoutes.js";
import blogRoute from './blogRoutes.js'
import sendMailRoute from "./sendMailRoutes.js";
import aiRoutes from "./aiRoutes.js";
import resumepool from "./resumepool.js"
const router = express.Router();

const path = "/api-v1/";

// router.use(`${path}auth`, authRoute); //api-v1/auth/
router.use(`${path}user`, userRoute);
router.use(`${path}companies`, companyRoute);
router.use(`${path}jobs`, jobRoute);
router.use(`${path}application`,applicationRoute)
router.use(`${path}blog`,blogRoute)
router.use(`${path}sendmail`, sendMailRoute);
router.use(`${path}ai`, aiRoutes);
router.use(`${path}resume`, resumepool);

export default router;