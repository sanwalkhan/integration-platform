// const axios = require('axios');
// const User = require('../models/User'); // Ensure that User model is imported

// // Fetch the HubSpot access token for the user
// exports.getAccessToken = async (userId) => {
//   try {
//     // Fetch the user from the database using the userId
//     const user = await User.findById(userId);
    
//     // If user is not found, throw an error
//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Return the HubSpot access token associated with the user
//     return user.hubspotAccessToken;
//   } catch (error) {
//     throw new Error('Error fetching HubSpot access token: ' + error.message);
//   }
// };

// // Fetch HubSpot contacts for the user
// exports.getContacts = async (userId) => {
//   try {
//     // Get the HubSpot access token for the user
//     const accessToken = await exports.getAccessToken(userId);

//     // Make the API request to HubSpot
//     const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`, // Add Bearer token in the header
//       },
//     });

//     // Return the fetched contacts
//     return response.data.results;
//   } catch (error) {
//     throw new Error('Error fetching contacts from HubSpot: ' + error.message);
//   }
// };


// exports.getHubSpotTokens = async (code) => {
//   try {
//     const response = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
//       params: {
//         grant_type: 'authorization_code',
//         client_id: process.env.HUBSPOT_CLIENT_ID,
//         client_secret: process.env.HUBSPOT_CLIENT_SECRET,
//         redirect_uri: process.env.HUBSPOT_REDIRECT_URI, // Make sure this matches
//         code, // The authorization code received from HubSpot
//       },
//     });

//     const { access_token, refresh_token } = response.data;

//     return { access_token, refresh_token };
//   } catch (error) {
//     console.error('Error exchanging authorization code:', error);
//     throw new Error('Error exchanging authorization code for tokens');
//   }
// };

const axios = require('axios');
const User = require('../models/User');

class HubSpotService {
  static async refreshAccessToken(userId) {
    const user = await User.findById(userId);
    
    try {
      const response = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
        params: {
          grant_type: 'refresh_token',
          client_id: process.env.HUBSPOT_CLIENT_ID,
          client_secret: process.env.HUBSPOT_CLIENT_SECRET,
          refresh_token: user.hubspotRefreshToken
        }
      });

      user.hubspotAccessToken = response.data.access_token;
      await user.save();

      return response.data.access_token;
    } catch (error) {
      console.error('Token refresh failed', error);
      throw new Error('Could not refresh HubSpot access token');
    }
  }

  static async fetchContacts(userId) {
    const user = await User.findById(userId);

    try {
      const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
        headers: {
          Authorization: `Bearer ${user.hubspotAccessToken}`
        }
      });

      return response.data.results;
    } catch (error) {
      // If token is expired, try to refresh
      if (error.response && error.response.status === 401) {
        const newAccessToken = await this.refreshAccessToken(userId);
        
        const refreshedResponse = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
          headers: {
            Authorization: `Bearer ${newAccessToken}`
          }
        });

        return refreshedResponse.data.results;
      }
      
      throw error;
    }
  }
}

module.exports = HubSpotService;