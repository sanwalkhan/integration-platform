const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = (user) => {
  const payload = {
    id: user._id,
    email: user.workEmail,
  };
  return jwt.sign(payload, keys.jwtSecret, { expiresIn: '1h' });
};
