import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Companies", required: true },
    application: [{ type: Schema.Types.ObjectId, ref: "Application" }],
    jobTitle: { type: String, required: [true, "Job Title is required"] },
    jobLocation: { type: String, required: [true, "Location is required"] },
    salary: {
      minSalary: { type: Number },
      maxSalary: { type: Number }
    },
    salaryConfidential: {
      type: Boolean,
      default: false,
    },
    salaryCategory:{
      type: String,
    },
    status: {
      type: String,
      enum: ["live", "draft", "deleted","paused"],
      default: "draft",
    },
    workType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Contract", "Temporary"],
      required: [true, "Work Type is required"]
    },
    workMode: {
      type: String,
      enum: ["Remote", "Hybrid", "Work From Office"],
      required: [true, "Work Mode is required"]
    },
    jobDescription: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
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
    experience: {
      minExperience: { type: Number },
      maxExperience: { type: Number }
    },
    companyType: { type: String },
    applicationLink: { type: String },
    duration: {
      type: String,
      default: "permanent",
    },
    poastingDate: {
      type: Date,
      default: Date.now,
    },
    // New fields from the screenshot
    graduationYear: {
      minBatch: { type: Number },
      maxBatch: { type: Number }
    },
    tags: {
      type: [String],
      default: [],
    },
    courseType: {
      type: String,
      enum: ["Full time", "Part time", "Distance Learning Program", "Executive Program", "Certification"],
    },
    // Diversity and inclusion fields
    diversityPreferences: {
      femaleCandidates: { type: Boolean, default: false },
      womenJoiningBackWorkforce: { type: Boolean, default: false },
      exDefencePersonnel: { type: Boolean, default: false },
      differentlyAbledCandidates: { type: Boolean, default: false },
      workFromHome: { type: Boolean, default: false },
    },
    category: {
      type: String,
      default: "",
    },
    functionalArea: {
      type: String,
      default: "",
    },
    // Premium job posting options
    isPremiumJob: {
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual field for total applications
jobSchema.virtual("totalApplications").get(function () {
  return this.application.length;
});

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;