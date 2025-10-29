sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/controls/Popover"
], function (BaseController, JSONModel, Popover) {
	"use strict";

	return BaseController.extend("com.sap.incidents.analytics.controller.Main", {

		onInit: function() {
			// Initialize the view model for chart data
			var oViewModel = new JSONModel({
				StatusData: [],
				totalCount: 0,
				newCount: 0,
				assignedCount: 0,
				inProgressCount: 0,
				resolvedCount: 0,
				closedCount: 0
			});
			this.getView().setModel(oViewModel, "view");

			// Load incidents data
			this._loadIncidentData();

			// Setup chart popover
			this._setupChartPopover();
		},

		_loadIncidentData: function() {
			var oModel = this.getOwnerComponent().getModel();
			var that = this;

			// Read incidents data using proper OData V4 binding
			var oBinding = oModel.bindList("/Incidents");
			oBinding.requestContexts().then(function(aContexts) {
				var aIncidents = aContexts.map(function(oContext) {
					return oContext.getObject();
				});
				that._processIncidentData(aIncidents);
			}).catch(function(oError) {
				console.error("Error loading incident data:", oError);
				// Fallback: try with OData V2 style read
				oModel.read("/Incidents", {
					success: function(oData) {
						that._processIncidentData(oData.results || oData.value || []);
					},
					error: function(oError) {
						console.error("Fallback error loading incident data:", oError);
					}
				});
			});
		},

		_processIncidentData: function(aIncidents) {
			var oViewModel = this.getView().getModel("view");
			
			// Count incidents by status
			var oStatusCounts = {
				"NEW": 0,
				"ASSIGNED": 0,
				"IN_PROGRESS": 0,
				"RESOLVED": 0,
				"CLOSED": 0
			};

			// Process each incident
			aIncidents.forEach(function(oIncident) {
				if (oStatusCounts.hasOwnProperty(oIncident.status)) {
					oStatusCounts[oIncident.status]++;
				}
			});

			// Prepare chart data
			var aChartData = [];
			Object.keys(oStatusCounts).forEach(function(sStatus) {
				if (oStatusCounts[sStatus] > 0) {
					aChartData.push({
						status: sStatus.replace(/_/g, " "),
						count: oStatusCounts[sStatus]
					});
				}
			});

			// Update view model
			oViewModel.setData({
				StatusData: aChartData,
				totalCount: aIncidents.length,
				newCount: oStatusCounts.NEW,
				assignedCount: oStatusCounts.ASSIGNED,
				inProgressCount: oStatusCounts.IN_PROGRESS,
				resolvedCount: oStatusCounts.RESOLVED,
				closedCount: oStatusCounts.CLOSED
			});

			// Update summary numbers in the view
			this._updateSummaryNumbers(oStatusCounts, aIncidents.length);
		},

		_updateSummaryNumbers: function(oStatusCounts, iTotalCount) {
			this.byId("totalIncidents").setNumber(iTotalCount.toString());
			this.byId("newIncidents").setNumber(oStatusCounts.NEW.toString());
			this.byId("inProgressIncidents").setNumber((oStatusCounts.ASSIGNED + oStatusCounts.IN_PROGRESS).toString());
			this.byId("resolvedIncidents").setNumber((oStatusCounts.RESOLVED + oStatusCounts.CLOSED).toString());
		},

		_setupChartPopover: function() {
			var oPopover = this.byId("idPopOver");
			var oVizFrame = this.byId("idPieChart");
			
			// Configure chart properties
			oVizFrame.setVizProperties({
				title: {
					text: "Incident Status Distribution"
				},
				plotArea: {
					dataLabel: {
						visible: true,
						showTotal: true
					}
				},
				legend: {
					visible: true,
					position: "right"
				}
			});
			
			// Setup popover
			oPopover.connect(oVizFrame.getVizUid());
			oPopover.setFormatString({
				"Count": {
					"formatString": "#,##0"
				}
			});
		}
	});
});
