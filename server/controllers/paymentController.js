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
            surl: "https://highimpacttalent.onrender.com/api-v1/payment/success",
            furl: "https://highimpacttalent.onrender.com/api-v1/payment/failure",
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

export const payuWebhook = async (req, res) => {
    try {
        console.log("Webhook received:", req.body);

        // Step 1: Extract data and the hash sent by PayU from the request body
        const receivedHash = req.body.hash;
        const {
            txnid,
            status,
            amount,
            productinfo,
            firstname,
            email
        } = req.body;

        // A basic check for essential data
        if (!receivedHash || !txnid || !status) {
            return res.status(400).json({ message: "Webhook data is incomplete." });
        }

        // Step 2: Construct the string for hash calculation EXACTLY as per PayU Webhook docs
        // The format is: salt|status|||||||||||email|firstname|productinfo|amount|txnid|key
        const hashString =
            `${PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_MERCHANT_KEY}`;

        // Step 3: Calculate the SHA-512 hash on your server using the generated string
        const calculatedHash = crypto
            .createHash("sha512")
            .update(hashString)
            .digest("hex");

        // Step 4: CRITICAL SECURITY CHECK: Compare your calculated hash with the one PayU sent
        if (receivedHash !== calculatedHash) {
            console.error("Webhook Hash Mismatch! Request is not authentic.");
            // If hashes don't match, reject the request.
            return res.status(401).json({ message: "Unauthorized. Hash verification failed." });
        }

        // --- If we reach here, the webhook is authentic and can be trusted ---
        console.log("Webhook hash verified successfully for txnid:", txnid);

        const payment = await Payment.findOne({ transactionId: txnid });

        if (!payment) {
            console.error("Payment not found for txnid:", txnid);
            return res.status(404).json({ message: "Payment not found" });
        }

        // Best Practice: Idempotency Check. Only update if the status is still PENDING.
        // This prevents re-processing if PayU sends the same webhook twice.
        if (payment.status !== "PENDING") {
            console.log(`Payment ${txnid} is already processed with status: ${payment.status}. Ignoring webhook.`);
            // Acknowledge the webhook to stop PayU from retrying, but don't change anything.
            return res.status(200).json({ message: "Payment already processed." });
        }

        // Update the payment status based on the verified status from the webhook
        switch (status.toLowerCase()) {
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
            default:
                payment.status = status.toUpperCase();
                break;
        }

        await payment.save();
        console.log("Payment status updated successfully to:", payment.status);

        // Finally, send a 200 OK response to PayU to acknowledge receipt.
        return res.status(200).json({ message: "Webhook received and payment status updated." });

    } catch (error) {
        console.error("Webhook processing error:", error);
        return res.status(500).json({ message: "Webhook processing failed", error: error.message });
    }
};

export const checkPaymentStatus = async (req, res) => {
    try {
      const userId = req.body.user.userId; 
      
      // Find the most recent payment for this user
      const payment = await Payment.findOne({ 
        userId: userId 
      }).sort({ createdAt: -1 });
  
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "No payment record found for this user"
        });
      }
  
      // Return payment status
      return res.status(200).json({
        success: true,
        paymentStatus: payment.status,
        transactionId: payment.transactionId,
        amount: payment.amount
      });
    } catch (error) {
      console.error("Payment status check failed:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to check payment status",
        error: error.message
      });
    }
  };