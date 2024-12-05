const axios = require('axios');

let authToken = process.env.INITIAL_AUTH_TOKEN; // Set initial token from .env

const refreshAuthToken = async () => {
  const url = 'https://213.121.244.34:8080/EnexxusSAPAmazonHybridAPIs/Authentication/RefreshAuthToken';

  const requestBody = {
    APIUsername: 'hubspot',
    APIPassword: 'U#$3%#P2+',
    EnexxusUserID: 'b2aedf0f-3f05-40bd-989c-34ea49adf242',
    CompanyUUID: 'a88d2bad-a9a1-4b92-9571-90dc46f04598',
    ExpiredAuthToken: authToken,
  };

  const headers = {
    AuthUser: 'admin',
    AuthToken: authToken,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, requestBody, { headers });
    authToken = response.data.RefreshAuthTokenResponseCollection[0].RefreshAuthToken;
    return authToken;
  } catch (error) {
    console.error('Failed to refresh SAP auth token:', error.message);
    throw new Error('Token refresh failed');
  }
};

// Middleware to ensure a valid token
const ensureSAPToken = async (req, res, next) => {
  try {
    if (!authToken) await refreshAuthToken();
    req.authToken = authToken; // Attach token to request
    next();
  } catch (error) {
    res.status(500).json({ message: 'Failed to authenticate with SAP' });
  }
};

module.exports = { ensureSAPToken, refreshAuthToken };
