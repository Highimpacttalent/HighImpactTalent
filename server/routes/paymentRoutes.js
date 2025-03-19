import express from "express";
const router = express.Router();
import { initializePayment, getPaymentStatus } from "../controllers/paymentController.js";

// Initialize payment
router.post("/initialize-payment", initializePayment);

// Get payment status
router.get("/payment-status/:transactionId?", getPaymentStatus);

export default router;