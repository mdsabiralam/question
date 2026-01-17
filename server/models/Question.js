const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['MCQ', 'Short Answer', 'Creative'],
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
