const User = require('../models/User');
const HubspotContact = require('../models/HubspotContact');
const Company = require('../models/Company');
const hubspotService = require('../hubspot/hubspotService');

exports.syncContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const contacts = await hubspotService.getContacts(user.hubspotAccessToken);

    const savedContacts = await Promise.all(
      contacts.map(async (contact) => {
        return HubspotContact.findOneAndUpdate(
          { hubspotId: contact.id },
          {
            hubspotId: contact.id,
            firstName: contact.properties.firstname,
            lastName: contact.properties.lastname,
            email: contact.properties.email,
            user: user._id,
          },
          { upsert: true, new: true }
        );
      })
    );

    res.status(200).json({ message: 'Contacts synced successfully', contacts: savedContacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.syncCompanies = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const companies = await hubspotService.getCompanies(user.hubspotAccessToken);

    const savedCompanies = await Promise.all(
      companies.map(async (company) => {
        return Company.findOneAndUpdate(
          { hubspotCompanyId: company.id },
          {
            hubspotCompanyId: company.id,
            name: company.properties.name,
            user: user._id,
          },
          { upsert: true, new: true }
        );
      })
    );

    res.status(200).json({ message: 'Companies synced successfully', companies: savedCompanies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleAuth = async (req, res) => {
  // Implement HubSpot OAuth flow
  res.status(200).send('HubSpot authentication initiated');
};

exports.handleCallback = async (req, res) => {
  // Handle HubSpot OAuth callback
  res.status(200).send('HubSpot authentication completed');
};