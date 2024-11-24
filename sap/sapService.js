const axios = require('axios');

const SAP_REFRESH_AUTH_URL = process.env.SAP_REFRESH_AUTH_URL;
const SAP_BUSINESS_PARTNER_URL = process.env.SAP_BUSINESS_PARTNER_URL;
const SAP_API_USERNAME = process.env.SAP_API_USERNAME;
const SAP_API_PASSWORD = process.env.SAP_API_PASSWORD;
const SAP_AUTH_USER = process.env.SAP_AUTH_USER;
const SAP_COMPANY_UUID = process.env.SAP_COMPANY_UUID;
const https = require('https');

let authToken = null;


// Create an HTTPS agent that allows self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Disable strict SSL validation
});


// Refresh Auth Token
const refreshAuthToken = async () => {
  try {
    const response = await axios.post(
      SAP_REFRESH_AUTH_URL,
      {
        APIUsername: SAP_API_USERNAME,
        APIPassword: SAP_API_PASSWORD,
        EnexxusUserID: SAP_AUTH_USER,
        CompanyUUID: SAP_COMPANY_UUID,
        ExpiredAuthToken: authToken,
      },
      {
        httpsAgent, // Use the custom HTTPS agent
      }
    );

    console.log('SAP API Response:', response.data); // Log the response
    const collection = response.data.RefreshAuthTokenResponseCollection;

    if (!collection || collection.length === 0) {
      throw new Error('Invalid response: RefreshAuthTokenResponseCollection is empty or null');
    }

    authToken = collection[0].RefreshAuthToken;
    return authToken;
  } catch (error) {
    console.error('Error refreshing auth token:', error.message);
    throw new Error('Failed to refresh SAP auth token');
  }
};


// Get All Business Partners
const getAllBusinessPartners = async () => {
  if (!authToken) await refreshAuthToken();

  try {
    const response = await axios.get(SAP_BUSINESS_PARTNER_URL, {
      headers: {
        CompanyUUID: SAP_COMPANY_UUID,
        AuthUser: SAP_AUTH_USER,
        AuthToken: authToken,
      },
    });
    return response.data.BusinessPartnerHeaderCollection;
  } catch (error) {
    console.error('Error fetching business partners:', error.message);
    throw new Error('Failed to fetch SAP business partners');
  }
};

module.exports = {
  refreshAuthToken,
  getAllBusinessPartners,
};
