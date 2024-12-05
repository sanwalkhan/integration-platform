const { getBusinessPartners } = require('../services/sapService');
const Trigger = require('../models/Trigger');
const Action = require('../models/Action');

// Fetch SAP business partners and associate them with the user
exports.fetchBusinessPartners = async (req, res) => {
  try {
    const userId = req.user._id;
    const businessPartners = await getBusinessPartners(userId);

    // Optionally store business partners in DB or trigger actions
    res.status(200).json({ message: 'Business partners fetched successfully', businessPartners });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process SAP triggers (e.g., log business partner data)
exports.processSAPTriggers = async (req, res) => {
  try {
    const triggers = await Trigger.find({ source: 'SAP', status: 'pending' });

    for (const trigger of triggers) {
      const action = await Action.create({
        triggerId: trigger._id,
        actionType: 'log_business_partner',
        actionData: trigger.eventData,
      });

      action.status = 'completed';
      await action.save();

      trigger.status = 'processed';
      await trigger.save();
    }

    res.status(200).json({ message: 'SAP triggers processed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
