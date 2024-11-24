const mongoose = require('mongoose');

const businessPartnerSchema = new mongoose.Schema({
  cardCode: { type: String, required: true, unique: true },
  cardName: { type: String, required: true },
  cardType: { type: String },
  groupCode: { type: String },
  groupName: { type: String },
  active: { type: Boolean },
  phone1: { type: String },
  email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('BusinessPartner', businessPartnerSchema);
