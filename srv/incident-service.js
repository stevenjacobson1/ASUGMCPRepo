const cds = require('@sap/cds');
const { businessPartnerSampleData } = require('./sample-business-partner-data');

module.exports = cds.service.impl(async function () {
  const { Incidents, Messages } = this.entities;
  // const external = await cds.connect.to('API_BUSINESS_PARTNER'); // Commented out since we use sample data

  // Read handler for BusinessPartner entity (value help)
  // Override the external service call with sample data
  this.on('READ', 'BusinessPartner', async (req) => {
    // Return sample business partner data for value help instead of calling external service
    let results = businessPartnerSampleData.map(bp => ({
      BusinessPartner: bp.BusinessPartner,
      BusinessPartnerFullName: bp.BusinessPartnerFullName,
      BusinessPartnerName: bp.BusinessPartnerName,
      Customer: bp.Customer,
      Supplier: bp.Supplier,
      BusinessPartnerCategory: bp.BusinessPartnerCategory,
      CreationDate: new Date().toISOString(),
      LastChangeDate: new Date().toISOString()
    }));
    
    // Apply filters if provided
    if (req.query.SELECT.where) {
      const whereClause = req.query.SELECT.where;
      // Simple filtering for demonstration - in production you'd want more robust filtering
      if (whereClause.some(clause => clause.ref && clause.ref[0] === 'BusinessPartner')) {
        const filterValue = whereClause.find(clause => clause.val)?.val;
        if (filterValue) {
          results = results.filter(bp => 
            bp.BusinessPartner.includes(filterValue) || 
            bp.BusinessPartnerFullName.toLowerCase().includes(filterValue.toLowerCase()) ||
            bp.BusinessPartnerName.toLowerCase().includes(filterValue.toLowerCase())
          );
        }
      }
    }
    
    // Apply search if provided
    if (req.query.SELECT.search) {
      const searchTerm = req.query.SELECT.search.toLowerCase();
      results = results.filter(bp => 
        bp.BusinessPartner.includes(searchTerm) ||
        bp.BusinessPartnerFullName.toLowerCase().includes(searchTerm) ||
        bp.BusinessPartnerName.toLowerCase().includes(searchTerm)
      );
    }
    
    return results;
  });

  // Read handler for Incidents
  this.on('READ', Incidents, async (req) => {
    const incidents = await SELECT.from(Incidents).where(req.query.SELECT.where);
    
    // Populate businessPartnerName for each incident
    for (const incident of incidents) {
      if (incident.businessPartner) {
        const bp = businessPartnerSampleData.find(bp => bp.BusinessPartner === incident.businessPartner);
        if (bp) {
          incident.businessPartnerName = bp.BusinessPartnerFullName || bp.BusinessPartnerName;
        }
      }
    }
    
    return incidents;
  });

  // Create handler for Incidents  
  this.on('CREATE', Incidents, async (req) => {
    const { businessPartner } = req.data;
    
    // Validate business partner exists
    if (businessPartner) {
      const bpExists = businessPartnerSampleData.find(bp => bp.BusinessPartner === businessPartner);
      if (!bpExists) {
        req.error(400, `Business Partner ${businessPartner} not found`);
      }
    }
    
    return await INSERT.into(Incidents).entries(req.data);
  });

  // Update handler for Incidents
  this.on('UPDATE', Incidents, async (req) => {
    const { businessPartner } = req.data;
    
    // Validate business partner exists if being updated
    if (businessPartner) {
      const bpExists = businessPartnerSampleData.find(bp => bp.BusinessPartner === businessPartner);
      if (!bpExists) {
        req.error(400, `Business Partner ${businessPartner} not found`);
      }
    }
    
    return await UPDATE(Incidents).set(req.data).where(req.query.UPDATE.where);
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
