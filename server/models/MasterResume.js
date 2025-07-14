import mongoose from 'mongoose'; 

// Define nested schemas for complex types
const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true, // Email should likely be unique per user profile system
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'] // Basic email format validation
  },
  phone: { type: String, trim: true }, // Optional
  linkedIn: { type: String, trim: true }, // Optional
  github: { type: String, trim: true }, // Optional
  website: { type: String, trim: true }, // Optional
  address: { type: String, trim: true }, // Optional
  city: { type: String, trim: true }, // Optional
  state: { type: String, trim: true }, // Optional
  country: { type: String, trim: true }, // Optional
  dateOfBirth: { type: Date }, // Keeping type Date, form might send null or string
  nationality: { type: String, trim: true }, // Optional
  // Removed willingToRelocate
  // Removed workAuthorization
}, { _id: false }); // Don't create a separate _id for this subdocument

const careerSummarySchema = new mongoose.Schema({
  shortSummary: { type: String, trim: true }, // Optional
  detailedObjective: { type: String, trim: true }, // Optional
}, { _id: false });

const educationSchema = new mongoose.Schema({
  university: { type: String, trim: true },
  degree: { type: String, trim: true },
  field: { type: String, trim: true },
  startDate: { type: String, trim: true }, // Storing as string like YYYY-MM
  endDate: { type: String, trim: true },   // Storing as string like YYYY-MM or "Present"
  gpa: { type: String, trim: true },       // Optional
  description: { type: String, trim: true },// Optional
});

const workExperienceSchema = new mongoose.Schema({
  role: { type: String, trim: true },
  company: { type: String, trim: true },
  location: { type: String, trim: true },
  type: { type: String, trim: true }, // e.g., Full-time, Part-time
  startDate: { type: String, trim: true }, // Storing as string like YYYY-MM
  endDate: { type: String, trim: true },   // Storing as string like YYYY-MM or "Present"
  isCurrent: { type: Boolean, default: false },
  responsibilities: [{ type: String, trim: true }], // Array of bullet points
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
    unique: true // A user should likely have only one master resume profile
  },
  personalInfo: personalInfoSchema,
  careerSummary: careerSummarySchema,
  education: [educationSchema], // Array of education entries
  workExperience: [workExperienceSchema],
  skills: [{ type: String, trim: true }],// Changed to single string for all skills
  achievements: [{ type: String, trim: true }], 
  volunteer: [{ type: String, trim: true }], // Array of volunteer strings
  storedResumes: [storedResumeSchema],
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Create and export the model
const MasterResume = mongoose.model('MasterResume', resumeSchema);

export default MasterResume;

