using { incidentmanagement as im } from '../db/schema';
using { API_BUSINESS_PARTNER_CC7 as external } from './external/API_BUSINESS_PARTNER_CC7';

service IncidentService @(path: '/incidents') {
  
  // Draft-enabled incidents service
  @odata.draft.enabled
  entity Incidents as projection on im.Incidents {
    *,
    virtual null as urgencyCriticality : Integer,
    virtual null as businessPartnerName : String
  };
  
  // Messages entity for conversation log
  entity Messages as projection on im.Messages;
  
  // Expose BusinessPartner from external service (READ only)
  @readonly
  entity BusinessPartner as projection on external.A_BusinessPartner {
    key BusinessPartner,
    BusinessPartnerFullName,
    BusinessPartnerName,
    Customer,
    Supplier,
    BusinessPartnerCategory,
    CreationDate,
    LastChangeDate
  };
}
