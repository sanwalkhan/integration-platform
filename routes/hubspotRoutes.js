const express = require('express');
const { getHubSpotAuthUrl, handleHubSpotCallback } = require('../hubspot/hubspotController');

const router = express.Router();

router.get('/hubspot-login', getHubSpotAuthUrl); 
router.get('/callback', handleHubSpotCallback); 

module.exports = router;
