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



router.get('/hubspot/authorize', (req, res) => {
  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${process.env.HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.HUBSPOT_REDIRECT_URI)}&scope=crm.objects.contacts.read`;
  res.redirect(authUrl);
});

router.get('/hubspot/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
        code
      }
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Find or create user and save tokens
    let user = await User.findOne({ email: req.user.email });
    if (!user) {
      user = new User({ email: req.user.email });
    }

    user.hubspotAccessToken = access_token;
    user.hubspotRefreshToken = refresh_token;
    await user.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error('HubSpot OAuth Error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;

