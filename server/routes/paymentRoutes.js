import express from "express";
const router = express.Router();
import { initializePayment, getPaymentStatus } from "../controllers/paymentController.js";
import userAuth from "../middlewares/authMiddleware.js";

// Initialize payment
router.post("/initialize-payment",userAuth, initializePayment);

// Get payment status
router.get("/payment-status/:transactionId?",userAuth, getPaymentStatus);

export default router;