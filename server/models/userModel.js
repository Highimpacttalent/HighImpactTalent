import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: function () {
        return !this.authProvider;
      },
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "linkedin"],
      default: "local",
    },
    providerId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    accountType: { type: String, default: "seeker" },
    contactNumber: { type: String },
    profileUrl: { type: String },
    cvUrl: { type: String },
    currentSalary: {
      type: String,
      default: "",
    },
    currentCompany: {
      type: String,
      default: "",
    },
    currentDesignation: {
      type: String,
      default: "",
    },
    isItConsultingCompany: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    linkedinLink: {
      type: String,
      default: "",
    },
    currentLocation: { type: String, default: "india" },
    openToRelocate: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    joinConsulting: {
      type: String,
      enum: ["Out of campus", "Lateral", "no", ""],
      default: "no",
    },
    about: { type: String },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      default: 1,
    },
    dateOfBirth: {
      type: String,
    },
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    likedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Jobs" }],
    expectedMinSalary: {
      type: String,
      default: "",
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
    preferredWorkTypes: {
      type: [String],
      default: ["Full-Time"],
    },
    preferredWorkModes: {
      type: [String],
      default: ["Remote"],
    },
    cultureFit: {
      strength: {
        type: String,
        default: "",
      },
      concern: {
        type: String,
        default: "",
      },
    },
    educationDetails: [
      {
        instituteName: {
          type: String,
          required: true,
        },
        startYear: {
          type: String,
          required: true,
        },
        endYear: {
          type: String,
          required: true,
        },
        courseName: {
          type: String,
          required: true,
        },
        specialization: {
          type: String,
          default: "",
        },
      },
    ],
    experienceHistory: [
      {
        companyName: {
          type: String,
          required: true,
        },
        designation: {
          type: String,
          required: true,
        },
        from: {
          type: String, // or use from & to as Dates if preferred
          required: true,
        },
        to: {
          type: String, // or use from & to as Dates if preferred
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    highestQualification: {
      type: [String],
    },
    lastConsultingCompany: {
      type: String,
      default: "",
    },
    totalYearsInConsulting: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// PERFORMANCE INDEXES - Add these for fast filtering
// Single field indexes for common filters
userSchema.index({ currentDesignation: 1 });
userSchema.index({ currentCompany: 1 });
userSchema.index({ currentLocation: 1 });
userSchema.index({ totalYearsInConsulting: 1 });
userSchema.index({ lastConsultingCompany: 1 });
userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });
userSchema.index({ email: 1 }); // Already exists due to unique, but explicit
userSchema.index({ accountType: 1 });

// Array field indexes for skills and locations
userSchema.index({ skills: 1 });
userSchema.index({ preferredLocations: 1 });
userSchema.index({ highestQualification: 1 });

// Text index for full-text search across multiple fields
userSchema.index({
  firstName: "text",
  lastName: "text",
  currentDesignation: "text",
  currentCompany: "text",
  lastConsultingCompany: "text",
  about: "text",
  "experienceHistory.companyName": "text",
  "experienceHistory.designation": "text",
  "experienceHistory.description": "text",
});

// Compound indexes for common filter combinations
userSchema.index({ accountType: 1, currentLocation: 1 });
userSchema.index({ accountType: 1, totalYearsInConsulting: 1 });
userSchema.index({ currentDesignation: 1, totalYearsInConsulting: 1 });
userSchema.index({ currentLocation: 1, totalYearsInConsulting: 1 });

// Sorting index
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });

// middelwares
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next(); // Call next to pass control to the next middleware
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Call next to signal that the middleware is done
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

const Users = mongoose.model("Users", userSchema);

export default Users;
