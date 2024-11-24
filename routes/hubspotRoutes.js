const express = require('express');
const hubspotController = require('../hubspot/hubspotController');

const router = express.Router();

router.get('/connect', hubspotController.handleAuth);
router.get('/callback', hubspotController.handleCallback);
router.get('/sync-contacts', hubspotController.syncContacts);
router.get('/sync-companies', hubspotController.syncCompanies);

module.exports = router;