// const express = require('express');
// const authController = require('../controllers/authController');
// const passport = require('passport');

// const router = express.Router();

// router.post('/register', authController.register);
// router.get('/verify-email', authController.verifyEmail);
// router.post('/login', authController.login);

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
// router.get('/microsoft', passport.authenticate('azuread-openidconnect', { scope: ['profile', 'email'] }));
// router.get('/microsoft/callback', passport.authenticate('azuread-openidconnect', { successRedirect: '/', failureRedirect: '/login' }));

// module.exports = router;

// routes/authRoutes.js
// authRoutes.js// routes/authRoutes.jsconst express = require('express');

const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const authenticateUser = require('../middleware/authMiddleware'); 


const router = express.Router();

// login
router.post('/login', authController.login);

// Verify code route
router.post('/verify-code', authController.verifyCode);

// Signup route
router.post('/signup', authController.signup);

// Google routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
  })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);

// Microsoft routes
router.get('/microsoft',
  passport.authenticate('microsoft', { 
    scope: ['user.read']
  })
);

router.get('/microsoft/callback', 
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  authController.microsoftCallback
);


router.get('/profile', authenticateUser, authController.getProfile);


module.exports = router;

