sap.ui.define([
	"demoapp/controller/BaseController",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/m/Menu",
	"sap/m/MenuItem",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet"
], function (BaseController, Device, Filter, Sorter, Menu, MenuItem, exportLibrary, Spreadsheet) {
	"use strict";

	return BaseController.extend("demoapp.controller.SalesOrderALV", {

		onInit: function () {
			// Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
			this._mViewSettingsDialogs = {};
		},
		onExit: function () {
			var oDialogKey,
				oDialogValue;

			for (oDialogKey in this._mViewSettingsDialogs) {
				oDialogValue = this._mViewSettingsDialogs[oDialogKey];

				if (oDialogValue) {
					oDialogValue.destroy();
				}
			}
		},
		createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			return oDialog;
		},

		handleSortButtonPressed: function () {
			this.createViewSettingsDialog("demoapp.view.SortDialog").open();
		},

		handleFilterButtonPressed: function () {
			this.createViewSettingsDialog("demoapp.view.FilterDialog").open();
		},

		handleGroupButtonPressed: function () {
			this.createViewSettingsDialog("demoapp.view.GroupDialog").open();
		},

		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("idTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},

		handleFilterDialogConfirm: function (oEvent) {
			var oTable = this.byId("idTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			mParams.filterItems.forEach(function (oItem) {
				var aSplit = oItem.getKey().split("___"),
					sPath = aSplit[0],
					sOperator = aSplit[1],
					sValue1 = aSplit[2],
					sValue2 = aSplit[3],
					oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});

			// apply filter settings
			oBinding.filter(aFilters);

			// update filter bar
			this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			this.byId("vsdFilterLabel").setText(mParams.filterString);
		},

		handleGroupDialogConfirm: function (oEvent) {
			var oTable = this.byId("idTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];

			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				// apply the selected group settings
				oBinding.sort(aGroups);
			}
		},
		onExport: function () {
			var aCols, oRowBinding, oSettings, oSheet, oTable;

			if (!this._oTable) {
				this._oTable = this.byId("idTable");
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding("items");

			aCols = this.createColumnConfig();

			var oModel = oRowBinding.getModel();

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: {
					type: "odata",
					dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
					// serviceUrl: "https://sapes5.sapdevcenter.com/sap/opu/odata/iwbep/GWSAMPLE_BASIC",
					serviceUrl: oModel.sServiceUrl,
					headers: oModel.getHeaders ? oModel.getHeaders() : null,
					count: oRowBinding.getLength ? oRowBinding.getLength() : null,
					useBatch: true // Default for ODataModel V2
				},
				count:15,
				fileName: "Sales Order Sample - ES5 OData Service.xlsx",
				worker: true,
				showProgress: true
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function () {
				oSheet.destroy();
			});
		},

		createColumnConfig: function () {
				var aCols = [];

				/*Column 1: SalesOrderID*/
				aCols.push({
					label: "Sales Order ID",
					type: "String",
					property: "SalesOrderID",
					width: 20,
					wrap: true
				});

				/*Column 2: Note*/
				aCols.push({
					label: "Note",
					type: "String",
					property: "Note",
					width: 30,
					wrap: true
				});

				/*Column 3: CustomerID*/
				aCols.push({
					label: "Customer ID",
					type: "String",
					property: "CustomerID",
					width: 20,
					wrap: true
				});

				/*Column 4: Customer Name*/
				aCols.push({
					label: "Customer Name",
					type: "String",
					property: "CustomerName",
					width: 20,
					wrap: true
				});

				/*Column 5: Gross Amount*/
				aCols.push({
					label: "Gross Amount",
					type: "Currency",
					property: "GrossAmount",
					unitProperty: "CurrencyCode",
					displayUnit: true,
					width: 15
				});

				/*Column 6: Net Amount*/
				aCols.push({
					label: "Net Amount",
					type: "Currency",
					property: "NetAmount",
					unitProperty: "CurrencyCode",
					displayUnit: true,
					width: 15
				});

				/*Column 7: Tax Amount*/
				aCols.push({
					label: "Tax Amount",
					type: "Currency",
					property: "TaxAmount",
					unitProperty: "CurrencyCode",
					displayUnit: true,
					width: 15
				});

				/*Column 8: LifecycleStatusDescription*/
				aCols.push({
					label: "Lifecycle Status",
					type: "String",
					property: "LifecycleStatusDescription",
					width: 20,
					wrap: true
				});

				/*Column 9: BillingStatusDescription*/
				aCols.push({
					label: "Billing Status",
					type: "String",
					property: "BillingStatusDescription",
					width: 20,
					wrap: true
				});

				/*Column 10: DeliveredStatusDescription*/
				aCols.push({
					label: "Delivered Status",
					type: "String",
					property: "DeliveredStatusDescription",
					width: 20,
					wrap: true
				});

				/*Column 11: CreatedAt*/
				aCols.push({
					label: "Created At",
					type: "DateTime",
					property: "CreatedAt"
				});

				/*Column 12: ChangedAt*/
				aCols.push({
					label: "Changed At",
					type: "DateTime",
					property: "ChangedAt"
				});

				return aCols;
			}
			
	});

});