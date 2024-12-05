const express = require('express');
const { fetchBusinessPartners, processSAPTriggers } = require('../controllers/sapController');
const { ensureSAPToken } = require('../middleware/sapAuthMiddleware');

const router = express.Router();

router.get('/business-partners', ensureSAPToken, fetchBusinessPartners); 
router.post('/process-triggers', processSAPTriggers); // Action: Process triggers

module.exports = router;
