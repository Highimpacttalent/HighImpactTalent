import express from "express";
import { addToWaitlist } from "../controllers/WaitlistController.js";

const router = express.Router();

//Added to waitlist

router.post("/waitlist", addToWaitlist);

export default router;