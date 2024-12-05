const axios = require('axios');
const dotenv = require('dotenv');
const https = require('https');

dotenv.config();

const BASE_URL = process.env.BASE_URL;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const refreshAuthToken = async (expiredToken) => {
  const url = `${BASE_URL}/Authentication/RefreshAuthToken`;
  const requestBody = {
    APIUsername: process.env.API_USERNAME,
    APIPassword: process.env.API_PASSWORD,
    EnexxusUserID: process.env.AUTH_USER,
    CompanyUUID: process.env.COMPANY_UUID,
    ExpiredAuthToken: expiredToken,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      httpsAgent,
    });
    return response.data.RefreshAuthTokenResponseCollection[0].RefreshAuthToken;
  } catch (error) {
    throw new Error(`Failed to refresh token: ${error.message}`);
  }
};

const getBusinessPartners = async (authToken) => {
  const url = `${BASE_URL}/BusinessPartner/GetAllBusinessPartnerDetails`;
  try {
    const response = await axios.get(url, {
      headers: {
        CompanyUUID: process.env.COMPANY_UUID,
        AuthUser: process.env.AUTH_USER,
        AuthToken: authToken,
      },
      httpsAgent,
    });
    return response.data.BusinessPartnerHeaderCollection;
  } catch (error) {
    throw new Error(`Failed to fetch business partners: ${error.message}`);
  }
};

module.exports = { refreshAuthToken, getBusinessPartners };
