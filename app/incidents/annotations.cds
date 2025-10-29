using IncidentService as service from '../../srv/incident-service';
annotate service.Incidents with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'businessPartner',
                Value : businessPartner,
            },
            {
                $Type : 'UI.DataField',
                Label : 'title',
                Value : title,
            },
            {
                $Type : 'UI.DataField',
                Label : 'description',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            },
            {
                $Type : 'UI.DataField',
                Label : 'urgency',
                Value : urgency,
            },
            {
                $Type : 'UI.DataField',
                Label : 'assignedTo',
                Value : assignedTo,
            },
            {
                $Type : 'UI.DataField',
                Label : 'resolutionNotes',
                Value : resolutionNotes,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'MessagesFacet',
            Label : 'Messages',
            Target : 'messages/@UI.LineItem',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'businessPartner',
            Value : businessPartner,
        },
        {
            $Type : 'UI.DataField',
            Label : 'title',
            Value : title,
        },
        {
            $Type : 'UI.DataField',
            Label : 'description',
            Value : description,
        },
        {
            $Type : 'UI.DataField',
            Label : 'status',
            Value : status,
        },
        {
            $Type : 'UI.DataField',
            Label : 'urgency',
            Value : urgency,
            Criticality : urgencyCriticality,
        },
    ],
);


annotate service.Messages with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Author',
            Value : author,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Content',
            Value : content,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Timestamp',
            Value : timestamp,
        },
    ],
);
