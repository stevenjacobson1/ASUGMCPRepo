sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: com.sap.incidents.analytics",
		defaults: {
			page: "ui5://test-resources/com/sap/incidents/analytics/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "com/sap/incidents/analytics/",
				never: "test-resources/com/sap/incidents/analytics/"
			},
			loader: {
				paths: {
					"com/sap/incidents/analytics": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for com.sap.incidents.analytics"
			},
			"integration/opaTests": {
				title: "Integration tests for com.sap.incidents.analytics"
			}
		}
	};
});
