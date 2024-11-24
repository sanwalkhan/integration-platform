const express = require('express');
const companyController = require('../controllers/companyController');

const router = express.Router();

// Route to create or update a company
router.post('/company', companyController.createOrUpdateCompany);

module.exports = router;
