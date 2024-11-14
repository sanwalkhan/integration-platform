const authService = require('../services/authService');
const passport = require('passport');

exports.register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).send({ message: 'User registered, verification email sent' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    await authService.verifyEmail(req.query.token);
    res.send({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user || !user.isEmailVerified) return res.status(400).send({ error: 'Invalid credentials or email not verified' });
    req.login(user, err => {
      if (err) return res.status(500).send({ error: 'Login failed' });
      res.send({ message: 'Logged in successfully' });
    });
  })(req, res, next);
};
