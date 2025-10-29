namespace incidentmanagement;

using { cuid, managed } from '@sap/cds/common';
using { Attachments } from '@cap-js/attachments';

// Status enumeration for incidents
type Status : String enum {
  NEW       = 'NEW';
  ASSIGNED  = 'ASSIGNED'; 
  IN_PROGRESS = 'IN_PROGRESS';
  RESOLVED  = 'RESOLVED';
  CLOSED    = 'CLOSED';
}

// Urgency enumeration for incidents  
type Urgency : String enum {
  HIGH      = 'HIGH';
  MEDIUM    = 'MEDIUM';
  LOW       = 'LOW';
}

// Conversation messages for incident communication
entity Messages : cuid, managed {
  incident    : Association to Incidents;
  author      : String(100);
  content     : String(1000);
  timestamp   : Timestamp;
}

// Main incidents entity
entity Incidents : cuid, managed {
  businessPartner     : String(10);  // Reference to BusinessPartner
  title              : String(100) not null;
  description        : String(1000);
  status             : Status default 'NEW';
  urgency            : Urgency default 'MEDIUM';
  assignedTo         : String(100);
  resolutionNotes    : String(1000);
  // Conversation log
  messages           : Composition of many Messages on messages.incident = $self;
  // Attachments support
  attachments        : Composition of many Attachments;
}
