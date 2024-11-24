const { Client } = require('@hubspot/api-client');

const hubspotClient = new Client({
  clientId: process.env.HUBSPOT_CLIENT_ID,
  clientSecret: process.env.HUBSPOT_CLIENT_SECRET,
});

const getAuthUrl = () => {
  return `https://app.hubspot.com/oauth/authorize?client_id=${process.env.HUBSPOT_CLIENT_ID}&redirect_uri=${process.env.HUBSPOT_REDIRECT_URI}&scope=contacts%20crm.objects.contacts.read%20crm.objects.contacts.write`;
};

const getAccessToken = async (code) => {
  const tokenResponse = await hubspotClient.oauth.tokensApi.createToken(
    'authorization_code',
    code,
    process.env.HUBSPOT_REDIRECT_URI,
    process.env.HUBSPOT_CLIENT_ID,
    process.env.HUBSPOT_CLIENT_SECRET
  );
  return tokenResponse.body;
};

module.exports = { getAuthUrl, getAccessToken };
