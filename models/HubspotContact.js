const mongoose = require('mongoose');

const hubspotContactSchema = new mongoose.Schema({
  hubspotId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  user: { 
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
}, { timestamps: true });

module.exports = mongoose.model('HubspotContact', hubspotContactSchema);
