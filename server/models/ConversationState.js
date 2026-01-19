const mongoose = require('mongoose');

const conversationStateSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currentState: { type: String, default: 'IDLE' },
  context: { type: Object, default: {} }, // Stores temp data like { class: '7' }
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ConversationState', conversationStateSchema);
