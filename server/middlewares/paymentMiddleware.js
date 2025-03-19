import Payment from "../models/paymentModel.js";

const paymentMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const payment = await Payment.findOne({ userId, status: "SUCCESS" });

        if (!payment) {
            return res.status(403).json({ message: "Access denied. Payment required." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { paymentMiddleware }; 