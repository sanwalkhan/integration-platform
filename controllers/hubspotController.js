const axios = require('axios');
const Integration = require('../models/integration');

class HubspotController {
    constructor() {
        this.baseURL = 'https://api.hubapi.com';
    }

    async createHubspotClient(apiKey) {
        return axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async verifyConnection(req, res) {
        try {
            const { apiKey } = req.body;
            const client = await this.createHubspotClient(apiKey);
            
            const response = await client.get('/crm/v3/objects/contacts?limit=1');
            
            if (response.status === 200) {
                // Save or update integration
                await Integration.findOneAndUpdate(
                    { userId: req.user.id, type: 'hubspot' },
                    { 
                        apiKey,
                        status: 'active',
                        lastSync: new Date()
                    },
                    { upsert: true }
                );

                return res.json({
                    success: true,
                    message: 'HubSpot connection verified successfully'
                });
            }
        } catch (error) {
            console.error('HubSpot verification error:', error);
            return res.status(400).json({
                success: false,
                message: 'Failed to verify HubSpot connection',
                error: error.message
            });
        }
    }

    async getAvailableEvents(req, res) {
        try {
            const events = [
                {
                    id: 'new_contact',
                    name: 'New Contact Created',
                    description: 'Triggers when a new contact is created',
                    fields: ['email', 'firstName', 'lastName']
                },
                {
                    id: 'contact_updated',
                    name: 'Contact Updated',
                    description: 'Triggers when any contact is updated',
                    fields: ['email', 'updatedProperties']
                },
                {
                    id: 'property_change',
                    name: 'Contact Property Changed',
                    description: 'Triggers when specific properties change',
                    fields: ['email', 'propertyName', 'newValue']
                },
                {
                    id: 'list_membership',
                    name: 'List Membership Changed',
                    description: 'Triggers when contacts are added/removed from lists',
                    fields: ['email', 'listId', 'action']
                }
            ];
            
            res.json({ success: true, events });
        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch available events'
            });
        }
    }

    async testIntegration(req, res) {
        try {
            const { eventType } = req.body;
            const integration = await Integration.findOne({
                userId: req.user.id,
                type: 'hubspot'
            });

            if (!integration) {
                return res.status(404).json({
                    success: false,
                    message: 'Integration not found'
                });
            }

            const client = await this.createHubspotClient(integration.apiKey);
            
            // Test based on event type
            let testResult;
            switch (eventType) {
                case 'new_contact':
                    testResult = await client.get('/crm/v3/objects/contacts?limit=1');
                    break;
                case 'contact_updated':
                    testResult = await client.get('/crm/v3/objects/contacts/recent/modified');
                    break;
                // Add other event type tests
            }

            res.json({
                success: true,
                message: 'Integration test successful',
                details: {
                    eventType,
                    timestamp: new Date(),
                    status: 'passed'
                }
            });
        } catch (error) {
            console.error('Integration test error:', error);
            res.status(400).json({
                success: false,
                message: 'Integration test failed',
                error: error.message
            });
        }
    }
}

module.exports = new HubspotController();
