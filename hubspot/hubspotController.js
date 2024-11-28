const axios = require('axios');
const User = require('../models/User');

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const HUBSPOT_REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI;

// Redirect user to HubSpot for login
exports.getHubSpotAuthUrl = (req, res) => {
  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${HUBSPOT_REDIRECT_URI}&scope=contacts`;
  res.status(200).json({ authUrl });
};

// Handle HubSpot OAuth callback
exports.handleHubSpotCallback = async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: HUBSPOT_REDIRECT_URI,
        code,
      },
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Get user details from HubSpot
    const userResponse = await axios.get('https://api.hubapi.com/oauth/v1/access-tokens/' + access_token);

    const hubspotId = userResponse.data.user_id;

    // Check if the user already exists
    let user = await User.findOne({ hubspotId });

    if (!user) {
      user = new User({
        hubspotId,
        name: userResponse.data.user,
        email: userResponse.data.user_email,
        hubspotAccessToken: access_token,
        hubspotRefreshToken: refresh_token,
        hubspotExpiresAt: new Date(Date.now() + expires_in * 1000),
      });
    } else {
      // Update tokens if user already exists
      user.hubspotAccessToken = access_token;
      user.hubspotRefreshToken = refresh_token;
      user.hubspotExpiresAt = new Date(Date.now() + expires_in * 1000);
    }

    await user.save();

    res.status(200).json({ message: 'HubSpot login successful', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
