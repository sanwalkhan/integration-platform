// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  hubspotId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);