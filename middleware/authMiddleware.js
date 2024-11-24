const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user does not exist' });
    }

    req.user = user; // Attach user object to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

module.exports = authenticateUser;
