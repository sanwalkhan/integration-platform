const express = require('express');
const passport = require('passport');
const router = express.Router();
const authService = require('../services/authService');

// Google OAuth route
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback route
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  const token = authService.generateToken(req.user);
  res.json({ token });
});

// Microsoft OAuth route
router.get('/microsoft', passport.authenticate('azuread-openidconnect', {
  prompt: 'select_account',
  failureRedirect: '/login',
}));

// Microsoft OAuth callback route
router.get('/microsoft/callback', passport.authenticate('azuread-openidconnect', { session: false }), async (req, res) => {
  const token = authService.generateToken(req.user);
  res.json({ token });
});

// User login
router.post('/login', authService.login);

// User signup
router.post('/signup', authService.signup);

module.exports = router;
