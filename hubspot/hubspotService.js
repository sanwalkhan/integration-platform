// services/hubspotService.js
const axios = require('axios');

exports.getContacts = async (apiKey) => {
  try {
    const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return response.data.results;
  } catch (error) {
    throw new Error('Error fetching contacts from HubSpot');
  }
};

exports.getCompanies = async (apiKey) => {
  try {
    const response = await axios.get('https://api.hubapi.com/crm/v3/objects/companies', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return response.data.results;
  } catch (error) {
    throw new Error('Error fetching companies from HubSpot');
  }
};