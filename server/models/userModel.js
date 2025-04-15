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
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: function() { return !this.authProvider; }
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'linkedin'],
      default: 'local'
    },
    providerId: {
      type: String,
      unique: true,
      sparse: true 
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    accountType: { type: String, default: "seeker" },
    contactNumber: { type: String },
    profileUrl: { type: String },
    cvUrl: { type: String },
    // currentJobRole: { type: String,default:"" },
    currentSalary: {
      type: String,
      default: "",
    },
    // currentConsultingCompany: {
    //   type: String,
    //   default: "",
    // },
    currentCompany: {
      type: String,
      default: "",
    },
    currentDesignation: {
      type: String,
      default: ""
    },
    isItConsultingCompany: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    linkedinLink: {
      type: String,
      default: ""
    },
    currentLocation: { type: String, default: "india" },
    openToRelocate: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    joinConsulting: {
      type: String,
      enum: ["Out of campus", "Lateral"],
      default: "Out of campus",
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
    dateOfBirth:{
      type:String,
    },
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      }
    ],    
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      }
    ],
    likedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Jobs" }],
    expectedMinSalary: {
      type: String,
      default: ""
    },
    preferredLocations: {
      type: [String],
      default: []
    },
    preferredWorkTypes: {
      type: [String],
      enum: ["Full-Time", "Part-Time", "Contract", "Temporary"],
      default: ["Full-Time"]
    },
    preferredWorkModes: {
      type: [String],
      enum: ["Remote", "Hybrid", "Work From Office"],
      default: ["Hybrid"]
    },
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
          default: ""
        }
      }
    ],
  },
  { timestamps: true }
);

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
