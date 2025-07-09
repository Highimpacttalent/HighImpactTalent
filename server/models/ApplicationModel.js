// Application Schema
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const applicationSchema = new Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Companies'
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  cvUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Applied",
      "Application Viewed",
      "Shortlisted",
      "Interviewing",
      "Hired",
      "Not Progressing",
    ],
    default: "Applied",
  },
  
  statusHistory: [
    {
      status: {
        type: String,
        enum: [
          "Applied",
          "Application Viewed",
          "Shortlisted",
          "Interviewing",
          "Hired",
          "Not Progressing",
        ],
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  resumeMatchLevel: {
    type: String,
    enum: ["relevant", "recommended", "not_relevant"],
    default: "not_relevant",
    index: true,
  },
  screeningAnswers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      question: {
        type: String,
        required: true
      },
      answer: {
        type: mongoose.Schema.Types.Mixed, // Can store String, Array, or Boolean
        required: true
      },
      // For validation and search optimization
      answerText: {
        type: String // Normalized text version for searching
      }
    }
  ]
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ job: 1, createdAt: -1 });

// Individual field indexes
applicationSchema.index({ job: 1 });
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ company: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });

// Screening answers index for filtering
applicationSchema.index({ 'screeningAnswers.questionId': 1 });
applicationSchema.index({ 'screeningAnswers.questionId': 1, 'screeningAnswers.answer': 1 });

// Pre-save middleware to normalize answers for better searching
applicationSchema.pre('save', function(next) {
  if (this.screeningAnswers && this.screeningAnswers.length > 0) {
    this.screeningAnswers.forEach(answer => {
      // Create searchable text version of answer
      if (answer.questionType === 'multi_choice' && Array.isArray(answer.answer)) {
        answer.answerText = answer.answer.join(', ');
      } else if (answer.questionType === 'yes/no') {
        answer.answerText = answer.answer.toString();
      } else {
        answer.answerText = answer.answer.toString();
      }
    });
  }
  next();
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;