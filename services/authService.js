const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  // Compare password if it's not a Google login
  if (user.password) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = generateToken(user);
  res.json({ token });
};

// User signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already in use' });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  const token = generateToken(newUser);
  res.status(201).json({ token });
};

module.exports = { login, signup, generateToken };
