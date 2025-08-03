import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const companySchema = new Schema({
  name: {
    type: String,
    required: [true, "Company Name is required"],
  },
  recruiterName: {
    type: String,
    required: [true, "Recruiter Name is required"],
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile Number is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    // select: true,
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
  },
  location: {
    type: String,
  },
  numberOfEmployees: {
    type: String,
    required: [true, "Number of Employees is required"],
    enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10000+"]
  },
  organizationType: {
    type: String,
    required: [true, "Organization Type is required"],
    enum: ["Startup", "Public", "Private", "Government", "Non-Profit", "MNC", "SME", "Indian MNC", "Other", "Consultant"]
  },
  copmanyType: {
    type: String,
    required: true,
    default: "copmany",
  },
  accountType: { 
    type: String, 
    default: "recruiter" 
  },
  contact: { 
    type: String 
  },
  about: { 
    type: String 
  },
  profileUrl: { 
    type: String 
  },
  jobPosts: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Jobs" 
  }],
}, {
  timestamps: true
});

// middlewares
companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    console.log("Password not modified, skipping hashing.");
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed:", this.password);
    next();
  } catch (err) {
    next(err);
  }
});

//compare password
companySchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

//JSON WEBTOKEN
companySchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

const Companies = mongoose.model("Companies", companySchema);

export default Companies;