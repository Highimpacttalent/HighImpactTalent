import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const applicationSchema = new Schema({
  job:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Jobs'
  },
  company:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Companies'
  },
  applicant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },
  status:{
    type: String,
      enum: [
        "applied", 
        "shortlisted", 
        "accepted", 
        "rejected",
        "deleted",
        "cancelled",
        "finished",
      ],
      default: "applied",
      required: true,
  }
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;