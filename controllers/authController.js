const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode'); 
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const passport = require('passport');




exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assume `req.user` contains authenticated user's ID from middleware

    const user = await User.findById(userId).select('firstName lastName profilePicture workEmail');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Signup handler
exports.signup = async (req, res) => {
  const { firstName, lastName, workEmail, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ workEmail });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Create a new user
    const newUser = new User({ firstName, lastName, workEmail, password });
    await newUser.save();

    // Generate a unique verification code
    const verificationCode = require('../services/emailService').generateVerificationCode();

    // Send the verification email with the code
    require('../services/emailService').sendInvitationEmail(workEmail, verificationCode, newUser._id);

    // Generate JWT (optional, if you want to send a token back)
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Verify code handler
exports.verifyCode = async (req, res) => {
  const { userId, verificationCode } = req.body;

  try {
    // Convert userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Find the verification code entry in the database
    const codeEntry = await VerificationCode.findOne({ userId: objectId });

    if (!codeEntry) {
      return res.status(404).json({ message: 'Code not found' });
    }

    // Check if the code has expired
    if (new Date() > codeEntry.expiresAt) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Check if the code matches
    if (codeEntry.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Mark the user as verified
    await User.findByIdAndUpdate(objectId, { isEmailVerified: true });

    // Optionally, generate a JWT for the verified user
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Email verified successfully', token });
  } catch (err) {
    console.error('Error verifying code:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Login handler
exports.login = async (req, res) => {
  const { workEmail, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ workEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    // Generate a JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.googleCallback = (req, res) => {
  handleAuthCallback(req, res);
};

exports.microsoftCallback = (req, res) => {
  handleAuthCallback(req, res);
};

function handleAuthCallback(req, res) {
  const user = req.user;
  const token = jwt.sign(
    { userId: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  // Redirect to frontend with token
  res.redirect(`${process.env.FRONTEND_URL}/dashboard.html`);
}

