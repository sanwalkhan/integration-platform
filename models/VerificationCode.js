const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verificationCode: { type: String, required: true },
  expiresAt: { type: Date, required: true }, 
});

verificationCodeSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date();
    this.expiresAt.setMinutes(this.expiresAt.getMinutes() + 5); 
  }
  next();
});

module.exports = mongoose.model('VerificationCode', verificationCodeSchema);
