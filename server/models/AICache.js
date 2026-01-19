const mongoose = require('mongoose');

const aiCacheSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  prompt: {
    type: Object,
    required: true
  },
  response: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // Automatically delete after 30 days
  }
});

module.exports = mongoose.model('AICache', aiCacheSchema);
