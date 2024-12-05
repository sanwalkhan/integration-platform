// const { getContacts, updateContact } = require('../services/hubspotService');
// const Trigger = require('../models/Trigger');
// const Action = require('../models/Action');
// const User = require('../models/User'); // Import the User model
// const axios = require('axios');


// exports.fetchContacts = async (req, res) => {
//   try {
//     const userId = req.user._id; // Retrieve user ID from the authenticated request
//     const contacts = await getContacts(userId); // Call the service to fetch contacts
//     res.status(200).json({ message: 'Contacts fetched successfully', contacts });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching contacts from HubSpot', error: error.message });
//   }
// };



// // Process HubSpot triggers (e.g., update lifecycle stage of a contact)
// exports.processHubSpotTriggers = async (req, res) => {
//   try {
//     const triggers = await Trigger.find({ source: 'HubSpot', status: 'pending' });

//     for (const trigger of triggers) {
//       const contactId = trigger.eventData.id;
//       const action = await Action.create({
//         triggerId: trigger._id,
//         actionType: 'update_contact',
//         actionData: { contactId, lifecycleStage: 'customer' },
//       });

//       try {
//         await updateContact(contactId, { lifecycleStage: 'customer' });
//         action.status = 'completed';
//       } catch (error) {
//         action.status = 'failed';
//         action.errorMessage = error.message;
//       }

//       await action.save();
//       trigger.status = 'processed';
//       await trigger.save();
//     }

//     res.status(200).json({ message: 'HubSpot triggers processed' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getHubSpotTokens = async (code) => {
//   try {
//     const response = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
//       params: {
//         grant_type: 'authorization_code',
//         client_id: process.env.HUBSPOT_CLIENT_ID,
//         client_secret: process.env.HUBSPOT_CLIENT_SECRET,
//         redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
//         code, // the code you received from HubSpot
//       },
//     });

//     const { access_token, refresh_token } = response.data;

//     return { access_token, refresh_token };
//   } catch (error) {
//     console.error('Error exchanging authorization code:', error);
//     throw new Error('Error exchanging authorization code for tokens');
//   }
// };

const HubSpotService = require('../services/hubspotService');

exports.getContacts = async (req, res) => {
  try {
    const contacts = await HubSpotService.fetchContacts(req.user.id);
    res.json({ 
      message: 'Contacts fetched successfully', 
      contacts 
    });
  } catch (error) {
    console.error('Contacts fetch error:', error);
    res.status(500).json({ error: 'Could not fetch contacts' });
  }
};