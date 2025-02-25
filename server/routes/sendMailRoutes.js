import express from "express";
import {sendContactQuery, sendRecruiterQuery, sendRecruiterQueryEmail} from "../controllers/sendMailController.js"; 

const router = express.Router();

router.post("/send", sendRecruiterQuery);

router.post("/sendEmail", sendRecruiterQueryEmail);

router.post("/contactus", sendContactQuery);

export default router;
