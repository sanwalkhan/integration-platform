const mongoose = require('mongoose');

const businessPartnerSchema = new mongoose.Schema({
  cardCode: { type: String, required: true, unique: true },
  cardName: { type: String, required: true },
  cardType: { type: String },
  phone1: { type: String },
  email: { type: String },
  active: { type: Boolean },
}, { timestamps: true });

module.exports = mongoose.model('SAPBusinessPartner', businessPartnerSchema);