sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"incidents/test/integration/pages/IncidentsList",
	"incidents/test/integration/pages/IncidentsObjectPage"
], function (JourneyRunner, IncidentsList, IncidentsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('incidents') + '/test/flpSandbox.html#incidents-tile',
        pages: {
			onTheIncidentsList: IncidentsList,
			onTheIncidentsObjectPage: IncidentsObjectPage
        },
        async: true
    });

    return runner;
});

