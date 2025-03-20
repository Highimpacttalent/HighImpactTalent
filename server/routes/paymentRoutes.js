import express from "express";
const router = express.Router();
import { initializePayment, getPaymentStatus, payuWebhook } from "../controllers/paymentController.js";
import userAuth from "../middlewares/authMiddleware.js";
import rateLimit from "express-rate-limit";

// Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many payment requests from this IP. Please try again after 15 minutes.",
});

// Initialize payment
router.post("/initialize-payment",userAuth,paymentLimiter, initializePayment);

// Get payment status
router.get("/payment-status/:transactionId?",userAuth,paymentLimiter, getPaymentStatus);

router.post("/payu-webhook/success", (req, res) => payuWebhook(req, res, "success"));
router.post("/payu-webhook/failed", (req, res) => payuWebhook(req, res, "failed"));
router.post("/payu-webhook/refund", (req, res) => payuWebhook(req, res, "refund"));
router.post("/payu-webhook/dispute", (req, res) => payuWebhook(req, res, "dispute"));

export default router;