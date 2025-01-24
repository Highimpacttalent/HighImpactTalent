import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Companies", required: true },
    application: [{ type: Schema.Types.ObjectId, ref: "Application" }],
    jobTitle: { type: String, required: [true, "Job Title is required"] },
    jobLocation: { type: String, required: [true, "Location is required"] },
    salary: { type: Number},

    salaryConfidential: {
      type: Boolean,
      default: false,
    },
    salaryCategory:{
      type:String,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    qualifications: [
      {
        type: String,
      },
    ],
    screeningQuestions: [
      {
        question: {
          type: String,
        },
        isMandatory: {
          type: Boolean,
          default: false,
        },
      },
    ],
    experience: { type: Number },
    companyType: { type: String },
    duration: {
      type: String,
      defult: "permanent",
    },
    poastingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;
