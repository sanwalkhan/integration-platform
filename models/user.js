const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Will be used only for non-Google/Microsoft signup
  googleId: { type: String }, // Used for Google OAuth login
  microsoftId: { type: String }, // Used for Microsoft OAuth login
  profilePicture: { type: String }, // Optional: store user's profile picture URL
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
