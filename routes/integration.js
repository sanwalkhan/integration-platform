const express = require('express');
const router = express.Router();
const hubspotController = require('../controllers/hubspotController');
const auth = require('../middleware/auth');

// HubSpot routes
router.post('/hubspot/verify', auth, hubspotController.verifyConnection.bind(hubspotController));
router.get('/hubspot/events', auth, hubspotController.getAvailableEvents.bind(hubspotController));
router.post('/hubspot/test', auth, hubspotController.testIntegration.bind(hubspotController));

module.exports = router;