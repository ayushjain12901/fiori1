sap.ui.define([
	"demoapp/controller/BaseController",
	"sap/m/ColumnListItem",
	"sap/m/Text"
], function (BaseController, ColumnListItem, Text) {
	"use strict";

	return BaseController.extend("demoapp.controller.SalesOrderLineItem", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._showSalesOrderDetails, this);
		},

		_showSalesOrderDetails: function (oEvent) {
			// debugger;
			var salesOrderId = oEvent.getParameter('arguments').sId;

			var aggrPath = "rootModel>/SalesOrderSet('" + salesOrderId + "')/ToLineItems";

			var row = new ColumnListItem({
				type: "Active",
				cells: [
					new Text({
						text: '{rootModel>ItemPosition}'
					}),
					new Text({
						text: '{rootModel>SalesOrderID}'
					}),
					new Text({
						text: '{rootModel>GrossAmount}'
					}),
					new Text({
						text: '{rootModel>Quantity}'
					})
				]
			});

			var oTable = this.getView().byId("idTable");

			/*Method 1: using bindAggregation method*/
			// oTable.bindAggregation("items",aggrPath,row);

			/*Method 2: using bindItems method*/
			oTable.bindItems(aggrPath, row);
		}
	});

});