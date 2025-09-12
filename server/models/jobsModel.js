import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Companies", required: true },
    hide: {
      type: Boolean,
      default: false,
    },
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
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
      },
      question: {
        type: String,
        required: true
      },
      questionType: {
        type: String,
        enum: ['yes/no', 'single_choice', 'multi_choice', 'short_answer', 'long_answer'],
        required: true
      },
      options: [{
        type: String
      }], // For single_choice and multi_choice questions
      isMandatory: {
        type: Boolean,
        default: false
      },
      order: {
        type: Number,
        default: 0
      }
    }
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
    keywords: {
      must_have: { type: [String], default: [] },
      nice_to_have: { type: [String], default: [] },
      bonus: { type: [String], default: [] },
      red_flags: { type: [String], default: [] }
    }
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