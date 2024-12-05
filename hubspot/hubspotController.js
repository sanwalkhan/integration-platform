const axios = require('axios');
const dotenv = require('dotenv');
const User = require('../models/User'); // Import User model

dotenv.config();

const BASE_URL = process.env.BASE_URL;

const getSAPAuthToken = async (userId) => {
  const user = await User.findById(userId);
  return user.sapAuthToken;
};

// Fetch business partners from SAP and associate them with the user
const getBusinessPartners = async (userId) => {
  const authToken = await getSAPAuthToken(userId);
  const url = `${BASE_URL}/BusinessPartner/GetAllBusinessPartnerDetails`;

  try {
    const response = await axios.get(url, {
      headers: {
        CompanyUUID: process.env.COMPANY_UUID,
        AuthUser: process.env.AUTH_USER,
        AuthToken: authToken,
      },
    });

    const businessPartners = response.data.BusinessPartnerHeaderCollection;
    return businessPartners;
  } catch (error) {
    throw new Error(`Failed to fetch business partners for user: ${error.message}`);
  }
};

module.exports = { getBusinessPartners };
