const axios = require('axios');
const User = require('../models/User');

exports.refreshHubSpotToken = async (req, res, next) => {
  try {
    const user = req.user;

    if (new Date() > new Date(user.hubspotExpiresAt)) {
      const tokenResponse = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
        params: {
          grant_type: 'refresh_token',
          client_id: process.env.HUBSPOT_CLIENT_ID,
          client_secret: process.env.HUBSPOT_CLIENT_SECRET,
          refresh_token: user.hubspotRefreshToken,
        },
      });

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      user.hubspotAccessToken = access_token;
      user.hubspotRefreshToken = refresh_token;
      user.hubspotExpiresAt = new Date(Date.now() + expires_in * 1000);
      await user.save();
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to refresh HubSpot token' });
  }
};
