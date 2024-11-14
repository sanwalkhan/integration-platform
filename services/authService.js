const User = require('../models/user');
const crypto = require('crypto');
const sendVerificationEmail = require('./emailService');

const registerUser = async (userData) => {
  const user = new User(userData);
  user.emailVerificationToken = crypto.randomBytes(20).toString('hex');
  await user.save();
  await sendVerificationEmail(user.email, user.emailVerificationToken);
  return user;
};

const verifyEmail = async (token) => {
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) throw new Error('Invalid verification token');
  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  await user.save();
};

module.exports = { registerUser, verifyEmail };
