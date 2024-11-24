// models/Integration.js
const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['hubspot']
    },
    apiKey: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'failed'],
        default: 'inactive'
    },
    config: {
        type: Object,
        default: {}
    },
    events: [{
        eventType: String,
        endpoint: String,
        enabled: Boolean
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastSync: {
        type: Date
    }
});

module.exports = mongoose.model('Integration', integrationSchema);
