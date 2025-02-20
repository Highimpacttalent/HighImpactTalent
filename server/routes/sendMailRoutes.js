import express from "express";
import {sendRecruiterQuery} from "../controllers/sendMailController.js"; 

const router = express.Router();

router.post("/send", sendRecruiterQuery);

export default router;
