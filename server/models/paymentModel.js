import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Companies", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
    transactionId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment; 