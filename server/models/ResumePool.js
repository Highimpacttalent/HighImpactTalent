import mongoose from "mongoose";

const resumepoolschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
    },
    cvUrl: { type: String },
    location: { type: String, default: "india" },
    experience: {
      type: String,
      default: 1,
    },    
    skills: {
      type: [String],
      default: [],
    },
    companies: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 3.5,
    },
  },
  { timestamps: true }
);

const ResumePool = mongoose.model("ResumePool", resumepoolschema);

export default ResumePool;
