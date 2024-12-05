const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    hubspotId: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Associate with the logged-in user
});

module.exports = mongoose.model('Contact', contactSchema);
