import mongoose from "mongoose";

const resumepoolschema = new mongoose.Schema(
  {
    // Personal Information
    personalInformation: {
      name: {
        type: String,
        required: [true, "Name is Required!"],
      },
      email: {
        type: String,
        required: [true, "Email is Required!"],
      },
      contactNumber: { type: String },
      linkedinLink: { type: String },
      dateOfBirth: { type: String },
      location: { type: String, default: "India" },
    },

    // Professional Details
    professionalDetails: {
      noOfYearsExperience: { type: Number, default: 1 },
      currentCompany: { type: String },
      currentDesignation: { type: String },
      salary: { type: String },
      about: { type: String },
      hasConsultingBackground: { type: Boolean, default: false },
    },

    // Education Details
    educationDetails: [
      {
        instituteName: { type: String, required: true },
        yearOfPassout: { type: Number, required: true },
      },
    ],

    // Work Experience
    workExperience: [
      {
        companyName: { type: String, required: true },
        jobTitle: { type: String, required: true },
        duration: { type: String, required: true },
        responsibilities: { type: [String], default: [] },
      },
    ],

    // Other Details
    skills: {
      type: [String],
      default: [],
    },
    topCompanies: { type: Boolean, default: false },
    topInstitutes: { type: Boolean, default: false },
    companiesWorkedAt: {
      type: [String],
      default: [],
    },
    jobRoles: {
      type: [String],
      default: [],
    },

    // Additional Fields
    cvUrl: { type: String },
  },
  { timestamps: true }
);

const ResumePool = mongoose.model("ResumePool", resumepoolschema);

export default ResumePool;
