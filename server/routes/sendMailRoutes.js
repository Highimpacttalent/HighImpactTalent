import express from "express";
import {sendRecruiterQuery, sendRecruiterQueryEmail} from "../controllers/sendMailController.js"; 

const router = express.Router();

router.post("/send", sendRecruiterQuery);

router.post("/sendEmail", sendRecruiterQueryEmail);

export default router;
