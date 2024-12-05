const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  triggerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trigger', required: true },
  actionType: { type: String, required: true },
  actionData: { type: Object },
  status: { type: String, default: 'pending' },
  errorMessage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Action', actionSchema);
