import mongoose from 'mongoose';

// Define nested schemas for complex types
const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    // Email unique constraint should typically be handled at the User account level,
    // not necessarily on each resume document if a user could theoretically have multiple resumes.
    // If unique per user's master profile, it's handled by the user_id unique constraint on the main schema.
    // Removed global unique constraint here.
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'] // Basic email format validation
  },
  phone: { type: String, required: true, trim: true }, // Changed to REQUIRED
  linkedIn: { type: String, required: true, trim: true }, // Changed to REQUIRED
  github: { type: String, trim: true }, // Optional
  website: { type: String, trim: true }, // Optional
  // address: { type: String, trim: true }, // Removed address line 1
  city: { type: String, trim: true }, // Optional (Mapped from frontend 'Current City')
  state: { type: String, trim: true }, // Optional (Mapped from frontend 'Current State')
  country: { type: String, trim: true }, // Optional (Mapped from frontend 'Current Country')
  dateOfBirth: { type: Date }, // Keeping type Date, frontend sends null or string
  nationality: { type: String, trim: true }, // Optional
}, { _id: false }); // Don't create a separate _id for this subdocument

const careerSummarySchema = new mongoose.Schema({
  // Changed to a single field for the combined summary
  summaryText: { type: String, trim: true }, // Optional
  // Removed shortSummary and detailedObjective
}, { _id: false });

const educationSchema = new mongoose.Schema({
  university: { type: String, trim: true },
  degree: { type: String, trim: true },
  field: { type: String, trim: true },
  startDate: { type: String, trim: true }, // Storing as string like YYYY-MM
  endDate: { type: String, trim: true },   // Storing as string like YYYY-MM or "Present"
  gpa: { type: String, trim: true },       // Optional
  description: { type: String, trim: true },// Optional
  // Note: No specific Mongoose validation for startDate < endDate here.
  // This validation is handled by the frontend dialog.
});

const workExperienceSchema = new mongoose.Schema({
  role: { type: String, trim: true },
  company: { type: String, trim: true },
  location: { type: String, trim: true }, // Optional
  type: { type: String, trim: true }, // e.g., Full-time, Part-time
  startDate: { type: String, trim: true }, // Storing as string like YYYY-MM
  endDate: { type: String, trim: true },   // Storing as string like YYYY-MM or "Present"
  isCurrent: { type: Boolean, default: false },
  responsibilities: [{ type: String, trim: true }], // Array of bullet points
   // Note: No specific Mongoose validation for startDate < endDate here.
  // This validation is handled by the frontend dialog.
  // No skills field added here; skills remain a global list for the master resume.
});

const storedResumeSchema = new mongoose.Schema({
  resumeName: { type: String, trim: true },
  link: { type: String,  trim: true },
}, { _id: false });


// Main Resume Schema
const resumeSchema = new mongoose.Schema({
  // Add user_id to link this resume to a specific user
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Assuming you have a 'User' model
    unique: true // Ensure only one master resume per user
  },
  personalInfo: { type: personalInfoSchema, required: true }, // Mark personalInfo subdocument as required
  careerSummary: careerSummarySchema, // Keep optional at the document level
  education: [educationSchema], // Array of education entries
  workExperience: [workExperienceSchema],
  skills: [{ type: String, trim: true }],// Array of skill strings (matches frontend array now)
  // achievements: [{ type: String, trim: true }], // Removed achievements field (combined)
  // awards: [{ type: String, trim: true }], // Removed awards field (combined)
  honorsAndAwards: [{ type: String, trim: true }], // New combined field
  volunteer: [{ type: String, trim: true }], // Array of volunteer strings
  storedResumes: [storedResumeSchema], // Array of stored resume links
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create and export the model
const MasterResume = mongoose.model('MasterResume', resumeSchema);

export default MasterResume;