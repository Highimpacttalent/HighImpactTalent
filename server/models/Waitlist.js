import mongoose, { Schema } from "mongoose";
import validator from "validator";

const waitlistUserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    joinedAt: { 
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const WaitlistUser = mongoose.model("WaitlistUser", waitlistUserSchema);

export default WaitlistUser;
