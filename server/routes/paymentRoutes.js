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
router.post("/initialize-payment", userAuth, initializePayment);

// Get payment status
router.get("/payment-status/:transactionId?", userAuth, getPaymentStatus);

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

// Frontend redirect routes (browser redirects from PayU to your frontend)
router.get("/success", (req, res) => {
    console.log("Received success redirect with query params:", req.query);
    // Redirect to your frontend success page
    res.redirect(`/payment-success?txnid=${req.query.txnid || ''}`);
});

router.post("/success", (req, res) => {
    console.log("Received POST success redirect with body:", req.body);
    // Some payment gateways might use POST instead of GET
    res.redirect(`/payment-success?txnid=${req.body.txnid || ''}`);
});

router.get("/failure", (req, res) => {
    console.log("Received failure redirect with query params:", req.query);
    // Redirect to your frontend failure page
    res.redirect(`/payment-failure?txnid=${req.query.txnid || ''}`);
});

router.post("/failure", (req, res) => {
    console.log("Received POST failure redirect with body:", req.body);
    // Some payment gateways might use POST instead of GET
    res.redirect(`/payment-failure?txnid=${req.body.txnid || ''}`);
});

export default router;