import express from "express";
const router = express.Router();
import { initializePayment, getPaymentStatus, payuWebhook, checkPaymentStatus} from "../controllers/paymentController.js";
import userAuth from "../middlewares/authMiddleware.js";
import rateLimit from "express-rate-limit";

// Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many payment requests from this IP. Please try again after 15 minutes.",
});

// Initialize payment
router.post("/initialize-payment", userAuth, initializePayment);

// Get payment status
router.get("/payment-status/:transactionId?", userAuth, getPaymentStatus);

router.get("/check-status", userAuth, checkPaymentStatus);

// PayU Webhook Routes (server-to-server communication)
router.post("/payu-webhook/success", (req, res) => {
    payuWebhook(req, res, "success");
});

router.post("/payu-webhook/failed", (req, res) => {
    payuWebhook(req, res, "failed");
});

router.post("/payu-webhook/refund", (req, res) => {
    payuWebhook(req, res, "refund");
});

router.post("/payu-webhook/dispute", (req, res) => {
    payuWebhook(req, res, "dispute");
});


router.post("/success", (req, res) => {
    res.redirect(`https://www.highimpacttalent.com/payment-success?txnid=${req.body.txnid || ''}`);
});

router.post("/failure", (req, res) => {
    res.redirect(`https://www.highimpacttalent.com/payment-failure?txnid=${req.body.txnid || ''}`);
});

export default router;