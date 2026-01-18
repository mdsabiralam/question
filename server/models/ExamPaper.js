const mongoose = require('mongoose');

const examPaperSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    default: 'Govt. High School'
  },
  examName: {
    type: String,
    default: 'Half Yearly Exam 2024'
  },
  time: {
    type: String,
    default: '2 Hours 30 Minutes'
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  questions: {
    type: Array, // Store the array of question objects
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('ExamPaper', examPaperSchema);
