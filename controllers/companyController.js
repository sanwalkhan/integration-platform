const Company = require('../models/Company'); 
// Create or Update Company
exports.createOrUpdateCompany = async (req, res) => {
  try {
    // Extract company data from the request body
    const { name, hubspotCompanyId } = req.body;

    // Check if the company already exists using the HubSpot Company ID
    let company = await Company.findOne({ hubspotCompanyId });

    if (company) {
      // If company exists, update it
      company.name = name || company.name;
      company.updatedAt = new Date();
    } else {
      // If company does not exist, create a new company
      company = new Company({
        name,
        hubspotCompanyId,
      });
    }

    // Save the company (either new or updated)
    await company.save();

    // Respond with the saved company
    res.status(200).json({
      message: 'Company created/updated successfully',
      company,
    });
  } catch (error) {
    console.error('Error creating/updating company:', error.message);
    res.status(500).json({
      message: 'Failed to create/update company',
      error: error.message,
    });
  }
};
