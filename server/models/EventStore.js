const mongoose = require('mongoose');

const eventStoreSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'anonymous'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  intent: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('EventStore', eventStoreSchema);
