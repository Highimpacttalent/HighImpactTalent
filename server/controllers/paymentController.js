// Initialize payment
import Payment from "../models/paymentModel.js";
import Companies from "../models/companiesModel.js"; 
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// PayU credentials (from environment variables)
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;
const PAYU_BASE_URL = process.env.PAYU_BASE_URL;

// Fixed payment amount
const STANDARD_AMOUNT = "1.00"; // Ensure it's a valid float

// Initialize payment
export const initializePayment = async (req, res) => {
    try {
        const userId = req.body.user.userId;

        // Fetch company details from the database
        const company = await Companies.findById(userId);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const { email, mobileNumber: phone, recruiterName: name } = company;

        // Generate a unique transaction ID
        const transactionId = uuidv4();

        // Create payment record with PENDING status
        const newPayment = new Payment({
            userId,
            amount: STANDARD_AMOUNT,
            transactionId,
            status: "PENDING",
        });

        await newPayment.save();

        // PayU payment request payload
        const paymentData = {
            key: PAYU_MERCHANT_KEY,
            txnid: transactionId,
            amount: STANDARD_AMOUNT,
            productinfo: "Subscription Plan",
            firstname: name, // Use recruiterName as firstname
            email,
            phone,
            surl: "https://www.highimpacttalent.com/payment-success",
            furl: "https://www.highimpacttalent.com/payment-failure",
            hash: "", // Hash will be calculated below
        };

        // Generate hash for PayU
        const hashString = `${PAYU_MERCHANT_KEY}|${transactionId}|${STANDARD_AMOUNT}|Subscription Plan|${name}|${email}|||||||||||${PAYU_MERCHANT_SALT}`;
        paymentData.hash = crypto
            .createHash("sha512")
            .update(hashString)
            .digest("hex");


        // Redirect user to PayU payment page
        res.status(200).json({
            message: "Payment initialized. Redirect to PayU.",
            paymentUrl: `${PAYU_BASE_URL}/_payment`,
            paymentData,
        });
    } catch (error) {
        console.error("Payment initialization error:", error);
        res.status(500).json({ message: "Failed to initialize payment" });
    }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;

        // Validate transactionId
        if (!transactionId) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }

        // Find payment by transactionId
        const payment = await Payment.findOne({ transactionId });

        if (!payment) {
            return res.status(404).json({ message: "No payment found" });
        }

        res.status(200).json({
            paymentId: payment._id,
            transactionId: payment.transactionId,
            amount: payment.amount,
            status: payment.status,
            createdAt: payment.createdAt,
        });
    } catch (error) {
        console.error("Get payment status error:", error);
        res.status(500).json({ message: "Failed to get payment status" });
    }
};

export const payuWebhook = async (req, res, status) => {
    try {
        console.log("Webhook received with status:", status);
        console.log("Request body:", req.body);

        const { txnid } = req.body;

        // Validate required fields
        if (!txnid) {
            console.error("Missing required field: txnid");
            return res.status(400).json({ message: "Missing transaction ID" });
        }

        // Find payment by transactionId
        const payment = await Payment.findOne({ transactionId: txnid });

        if (!payment) {
            console.error("Payment not found for txnid:", txnid);
            return res.status(404).json({ message: "Payment not found" });
        }

        console.log("Payment found:", payment);

        // Update payment status based on the event type
        // Use the status from PayU if available, otherwise use the provided status parameter
        const finalStatus = (req.body.status && req.body.status.toLowerCase()) || status;
        
        switch (finalStatus) {
            case "success":
                payment.status = "SUCCESS";
                break;
            case "failure":
            case "failed":
                payment.status = "FAILED";
                break;
            case "refund":
                payment.status = "REFUNDED";
                break;
            case "dispute":
                payment.status = "DISPUTED";
                break;
            default:
                payment.status = "PENDING";
                break;
        }

        console.log("Updating payment status to:", payment.status);

        await payment.save();

        console.log("Payment status updated successfully");

        return res.status(200).json({ message: "Webhook received and payment status updated" });
    } catch (error) {
        console.error("Webhook error:", error);
        return res.status(500).json({ message: "Webhook processing failed", error: error.message });
    }
};