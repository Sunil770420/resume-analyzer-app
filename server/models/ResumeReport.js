const mongoose = require("mongoose");

const resumeReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    fileName: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    suggestions: {
      type: [String],
      default: [],
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    foundSections: {
      type: [String],
      default: [],
    },
    missingSections: {
      type: [String],
      default: [],
    },
    foundSkills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResumeReport", resumeReportSchema);