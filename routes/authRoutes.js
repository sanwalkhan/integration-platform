const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');

const router = express.Router();

router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
router.get('/microsoft', passport.authenticate('azuread-openidconnect', { scope: ['profile', 'email'] }));
router.get('/microsoft/callback', passport.authenticate('azuread-openidconnect', { successRedirect: '/', failureRedirect: '/login' }));

module.exports = router;
