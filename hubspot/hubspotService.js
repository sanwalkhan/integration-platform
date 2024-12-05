const axios = require('axios');
const dotenv = require('dotenv');
const User = require('../models/User'); // Import User model

dotenv.config();

const BASE_URL = 'https://api.hubapi.com';

const getAccessToken = (userId) => {
  return User.findById(userId).then(user => user.hubspotAccessToken);
};

// Fetch contacts from HubSpot and associate them with the user
const getContacts = async (userId) => {
  const accessToken = await getAccessToken(userId);
  const url = `${BASE_URL}/crm/v3/objects/contacts`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Store the contacts with the user data in your database if needed
    const contacts = response.data.results;
    return contacts;
  } catch (error) {
    throw new Error(`Failed to fetch contacts for user: ${error.message}`);
  }
};

module.exports = { getContacts };
