const mongoose = require('mongoose');

const triggerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  eventType: { type: String, required: true },
  eventData: { type: Object, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Trigger', triggerSchema);
