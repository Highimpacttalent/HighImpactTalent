import Payment from "../models/paymentModel.js";
import { v4 as uuidv4 } from "uuid";

// Fixed payment amount
const STANDARD_AMOUNT = 499;

// Initialize payment (for testing)
export const initializePayment = async (req, res) => {
    try {
        const userId = req.body.user.userId;

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

        // Simulate payment success for testing
        // In production, you would redirect to PayU's payment page
        setTimeout(async () => {
            newPayment.status = "SUCCESS";
            await newPayment.save();
        }, 5000); // Simulate a 5-second delay for payment processing

        res.status(200).json({
            message: "Payment initialized. Simulating success in 5 seconds.",
            paymentId: newPayment._id,
            transactionId,
            amount: STANDARD_AMOUNT,
        });
    } catch (error) {
        console.error("Payment initialization error:", error);
        res.status(500).json({ message: "Failed to initialize payment" });
    }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
    try {
        // Get userId from either req.user (if set by auth middleware) or from query params
        const userId = req.body.user.userId;
        const { transactionId } = req.params;

        const payment = await Payment.findOne(transactionId).sort({ createdAt: -1 });

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