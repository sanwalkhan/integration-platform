// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  hubspotId: { type: String, required: true, unique: true },
  name: { type: String },
  domain: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);