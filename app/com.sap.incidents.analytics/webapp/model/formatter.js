sap.ui.define([
	"sap/ui/core/library"
], function (coreLibrary) {
	"use strict";

	var ValueState = coreLibrary.ValueState;

	return {
		formatValue: function (value) {
			return value && value.toUpperCase();
		},

		formatStatusState: function (status) {
			switch (status) {
				case "NEW":
					return ValueState.Error;
				case "ASSIGNED":
					return ValueState.Warning;
				case "IN_PROGRESS":
					return ValueState.Warning;
				case "RESOLVED":
					return ValueState.Success;
				case "CLOSED":
					return ValueState.Success;
				default:
					return ValueState.None;
			}
		},

		formatUrgencyState: function (urgency) {
			switch (urgency) {
				case "HIGH":
					return ValueState.Error;
				case "MEDIUM":
					return ValueState.Warning;
				case "LOW":
					return ValueState.Success;
				default:
					return ValueState.None;
			}
		},

		formatDate: function (date) {
			if (!date) {
				return "";
			}
			var oDate = new Date(date);
			return oDate.toLocaleDateString() + " " + oDate.toLocaleTimeString();
		}
	};
});
