const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const analyzeResume = require("../utils/resumeAnalyzer");
const ResumeReport = require("../models/ResumeReport");

const extractTextFromFile = async (file) => {
  if (file.mimetype === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const data = await mammoth.extractRawText({ buffer: file.buffer });
    return data.value;
  }

  throw new Error("Only PDF and DOCX files are supported for analysis.");
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    const resumeText = await extractTextFromFile(req.file);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message:
          "Could not read enough text from this resume. Please upload a clear PDF or DOCX file.",
      });
    }

    const analysis = analyzeResume(resumeText);

    const report = await ResumeReport.create({
      userId: req.body.userId || null,
      fileName: req.file.originalname,
      score: analysis.score,
      feedback: analysis.feedback,
      suggestions: analysis.suggestions,
      wordCount: analysis.wordCount,
      foundSections: analysis.foundSections,
      missingSections: analysis.missingSections,
      foundSkills: analysis.foundSkills,
    });

    return res.status(200).json({
      success: true,
      message: "Resume analyzed and saved successfully",
      reportId: report._id,
      fileName: req.file.originalname,
      ...analysis,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserReports = async (req, res) => {
  try {
    const { userId } = req.params;

    const reports = await ResumeReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  getUserReports,
};