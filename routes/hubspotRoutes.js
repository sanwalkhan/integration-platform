// const express = require('express');
// const router = express.Router();
// const hubspotController = require('../controllers/hubspotController');
// const authenticateUser = require('../middleware/authMiddleware'); // Import authenticateUser middleware
// const { getHubSpotTokens } = require('../services/hubspotService'); // Import getHubSpotTokens from the service

// // OAuth callback route from HubSpot
// router.get('/hubspot-callback', async (req, res) => {
//   const { code } = req.query; // Capture the authorization code from HubSpot

//   // Check if the code exists
//   if (!code) {
//     return res.status(400).json({ message: 'Authorization code is missing' });
//   }

//   try {
//     const { access_token, refresh_token } = await getHubSpotTokens(code); // Use the captured code
//     const user = await User.findById(req.user._id); // Assuming `req.user` is populated
//     user.hubspotAccessToken = access_token;
//     user.hubspotRefreshToken = refresh_token;
//     await user.save();
//     res.status(200).json({ message: 'HubSpot account linked successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error linking HubSpot account', error: error.message });
//   }
// });

// // Route to fetch contacts from HubSpot (Protected route)
// router.get('/contacts', authenticateUser, hubspotController.fetchContacts);

// // Route to process HubSpot triggers (Protected route)
// router.post('/process-triggers', authenticateUser, hubspotController.processHubSpotTriggers);

// module.exports = router;

const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Contact = require('../models/Contact');

const verifyJwtToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

router.get('/authorize', (req, res) => {
  const token = req.query.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${process.env.HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    process.env.HUBSPOT_REDIRECT_URI
  )}&scope=crm.objects.contacts.read&state=${token}`;
  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  const { code, state: token } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.HUBSPOT_CLIENT_ID,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET,
        redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
        code,
      },
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Find the user and update with HubSpot tokens
    const user = await User.findByIdAndUpdate(
      userId, 
      {
        hubspotAccessToken: access_token,
        hubspotRefreshToken: refresh_token
      },
      { new: true }
    );

    // Fetch contacts from HubSpot
    const contactsResponse = await axios.get('https://api.hubapi.com/contacts/v1/lists/all/contacts/all', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Save contacts to the database
    const contacts = contactsResponse.data.contacts;
    const savedContacts = await Promise.all(contacts.map(async (contact) => {
      const newContact = new Contact({
        hubspotId: contact.vid,
        firstName: contact.properties.firstname ? contact.properties.firstname.value : 'N/A',
        lastName: contact.properties.lastname ? contact.properties.lastname.value : 'N/A',
        email: contact.properties.email ? contact.properties.email.value : 'N/A',
        phone: contact.properties.phone ? contact.properties.phone.value : 'N/A',
        user: userId,
      });

      return newContact.save();
    }));

    // Redirect back to frontend with success
    res.redirect(`http://127.0.0.1:5500/create.html`);
  } catch (error) {
    console.error('Error during HubSpot OAuth callback:', error);
    // Redirect back to frontend with error
    res.redirect('http://localhost:3000/dashboard?status=error');
  }
});

module.exports = router;

