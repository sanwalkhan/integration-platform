// middlewares/authenticateUser.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure this import is correct

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from headers

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    const user = await User.findById(decoded.userId); // Fetch user from DB using decoded userId

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach the user object to the request
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
