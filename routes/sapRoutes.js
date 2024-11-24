const express = require('express');
const hubspotController = require('../hubspot/hubspotController');
const sapController = require('../sap/sapController');

const router = express.Router();

router.get('/hubspot/connect', hubspotController.handleAuth);
router.get('/hubspot/callback', hubspotController.handleCallback);
router.get('/hubspot/sync-contacts', hubspotController.syncContacts);
router.get('/hubspot/sync-companies', hubspotController.syncCompanies);
router.get('/sap/sync-data', sapController.syncData);

module.exports = router;