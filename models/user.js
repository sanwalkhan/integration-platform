const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function () { return !this.googleId && !this.microsoftId && !this.hubspotId; } },
  googleId: { type: String },
  microsoftId: { type: String },
  hubspotId: { type: String }, // HubSpot User ID
  hubspotAccessToken: { type: String }, // OAuth Access Token
  hubspotRefreshToken: { type: String }, // OAuth Refresh Token
  hubspotExpiresAt: { type: Date }, // Token Expiry
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;



// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   workEmail: { type: String, required: true, unique: true },
//   password: { type: String },
//   hubspotAccessToken: { type: String },
//   hubspotRefreshToken: { type: String },
// }, { timestamps: true });

// userSchema.pre('save', async function (next) {
//   if (this.password && this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }
//   next();
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);
