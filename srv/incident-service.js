const cds = require('@sap/cds');
const { businessPartnerSampleData } = require('./sample-business-partner-data');

module.exports = cds.service.impl(async function() {
    const { Incidents } = this.entities;

    // Business Partner value help handler
    this.on('READ', 'BusinessPartner', async (req) => {
        return businessPartnerSampleData;
    });

    // Add criticality mapping for urgency field
    this.after('READ', 'Incidents', (data) => {
        if (Array.isArray(data)) {
            data.forEach(incident => {
                incident.urgencyCriticality = mapUrgencyToCriticality(incident.urgency);
            });
        } else if (data) {
            data.urgencyCriticality = mapUrgencyToCriticality(data.urgency);
        }
    });

    function mapUrgencyToCriticality(urgency) {
        switch (urgency) {
            case 'HIGH':
                return 1; // Negative (red)
            case 'MEDIUM':
                return 2; // Critical (orange)
            case 'LOW':
                return 3; // Positive (green)
            default:
                return 2; // Default to medium criticality
        }
    }

    // Before UPDATE - prevent modification of closed incidents
    this.before('UPDATE', 'Incidents', async (req) => {
        const incident = await SELECT.one.from(Incidents).where({ ID: req.data.ID });
        
        if (incident && incident.status === 'CLOSED') {
            req.error(400, 'Closed incidents cannot be modified');
        }
    });

    // Before CREATE and UPDATE - set urgency to HIGH if title contains "urgent"
    this.before(['CREATE', 'UPDATE'], 'Incidents', async (req) => {
        if (req.data.title && req.data.title.toLowerCase().includes('urgent')) {
            req.data.urgency = 'HIGH';
        }
    });

    // Before PATCH - prevent modification of closed incidents
    this.before('PATCH', 'Incidents', async (req) => {
        const incident = await SELECT.one.from(Incidents).where({ ID: req.data.ID });
        
        if (incident && incident.status === 'CLOSED') {
            req.error(400, 'Closed incidents cannot be modified');
        }
        
        // Also handle urgency logic for PATCH operations
        if (req.data.title && req.data.title.toLowerCase().includes('urgent')) {
            req.data.urgency = 'HIGH';
        }
    });

    // Handle draft operations for closed incidents
    this.before('EDIT', 'Incidents', async (req) => {
        const incident = await SELECT.one.from(Incidents).where({ ID: req.data.ID });
        
        if (incident && incident.status === 'CLOSED') {
            req.error(400, 'Closed incidents cannot be modified');
        }
    });

    // Handle draft save operations
    this.before('SAVE', 'Incidents', async (req) => {
        // Check if the incident is being set to closed after being in draft
        const incident = await SELECT.one.from(Incidents).where({ ID: req.data.ID });
        
        if (incident && incident.status === 'CLOSED') {
            req.error(400, 'Closed incidents cannot be modified');
        }
        
        // Handle urgency logic for SAVE operations
        if (req.data.title && req.data.title.toLowerCase().includes('urgent')) {
            req.data.urgency = 'HIGH';
        }
    });
});
