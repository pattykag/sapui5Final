sap.ui.define([
    "com/curso/final/controller/BaseController",
    "com/curso/final/utils/Services",
    "sap/ui/model/json/JSONModel",
    "com/curso/final/utils/Constants",
    "com/curso/final/utils/formatter",
    "sap/ui/core/routing/History",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/model/Sorter",
    "sap/m/library"
], function(Controller, Services, JSONModel, Constants, formatter, History, Filter, FilterOperator, Sorter, mLibrary) {
    "use strict";

    return Controller.extend("com.curso.final.controller.SecondView", {
        formatter: formatter,
        _mViewSettingsDialogs: {},
        onInit: function() {
            this.loadModel();
            this._oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        loadModel: async function() {
            const oResponse = await Services.getLocalJSON("productos.json");
            var oModelProducts = new JSONModel(oResponse[0]);
            this.getOwnerComponent().setModel(oModelProducts, Constants.models.products);
        },

        onSearch: function(oEvent) {
            let aFilters = [],
                oFilters
            let sQuery = oEvent.getSource().getValue() //input

            if (sQuery && sQuery.length > 0) {
                let oCodProductFilter = new Filter("codigo_producto", FilterOperator.Contains, sQuery);
                aFilters.push(oCodProductFilter);

                let oCodInterno = new Filter("cod_interno", FilterOperator.Contains, sQuery);
                aFilters.push(oCodInterno);

                let oNombreEmpresa = new Filter("nombre_empresa", FilterOperator.Contains, sQuery);
                aFilters.push(oNombreEmpresa);

                let oOrigenFilter = new Filter("origen", FilterOperator.Contains, sQuery);
                aFilters.push(oOrigenFilter);

                let oFechaCreacionFilter = new Filter("fecha_creacion", FilterOperator.Contains, sQuery);
                aFilters.push(oFechaCreacionFilter);

                oFilters = new Filter(aFilters);
            }

            // update list binding
            let oTable = this.getView().byId("idProductsTable")
            let oBindingInfo = oTable.getBinding("items")
            oBindingInfo.filter(oFilters, "Filters")
        },

        createViewSettingsDialog: function(sDialogFragmentName) {
            var oDialog;
            oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
            this.getView().addDependent(oDialog);

            return oDialog;
        },

        onClearFilter: function() {
            var oTable = this.byId("idProductsTable"),
                oBinding = oTable.getBinding("items");

            oBinding.filter(null, "Filters");

            // otras limpiezas
            this.byId("idSearch").setValue("");
        },

        onSort: function() {
            this.createViewSettingsDialog(Constants.fragments.dialogs.sortDialog).open();
        },

        onSortDialogConfirm: function(oEvent) {
            var oTable = this.byId("idProductsTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                aSorters = [];
            sPath = mParams.sortItem.getKey();

            bDescending = mParams.sortDescending;
            aSorters.push(new Sorter(sPath, bDescending));
            oBinding.sort(aSorters);
        },

        onFilter: function() {
            this.OPcreateViewSettingsDialog(Constants.fragments.dialogs.filterDialog).open();
        },

        OPcreateViewSettingsDialog: function(sDialogFragmentName) {
            var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];
            if (!oDialog) {
                oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
                this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
                this.getView().addDependent(oDialog);
                oDialog.setFilterSearchOperator(mLibrary.StringFilterOperator.Contains);
                //create Filter dialog

                var oModelJSON = this.getView().getModel(Constants.models.products);
                var modelOriginal = oModelJSON.oData.value;
                var jsonCodProd = JSON.parse(JSON.stringify(modelOriginal, ["codigo_producto"]));
                var jsonCodInterno = JSON.parse(JSON.stringify(modelOriginal, ["cod_interno"]));
                var jsonFechaCreacion = JSON.parse(JSON.stringify(modelOriginal, ["fecha_creacion"]));
                var jsonOrigen = JSON.parse(JSON.stringify(modelOriginal, ["origen"]));
                var jsonNombreEmpresa = JSON.parse(JSON.stringify(modelOriginal, ["nombre_empresa"]));
                oDialog.setModel(oModelJSON);

                //check for duplicates in filter items
                jsonCodProd = this.duplicateFunction(jsonCodProd);
                jsonCodInterno = this.duplicateFunction(jsonCodInterno);
                jsonFechaCreacion = this.duplicateFunction(jsonFechaCreacion);
                jsonOrigen = this.duplicateFunction(jsonOrigen);
                jsonNombreEmpresa = this.duplicateFunction(jsonNombreEmpresa);

                //create items arrays and iterate   
                var aCodProdFilter = this.arrayItemsFunction(jsonCodProd, "codigo_producto");
                var aCodInternoFilter = this.arrayItemsFunction(jsonCodInterno, "cod_interno");
                var aFechaCreacionFilter = this.arrayItemsFunction(jsonFechaCreacion, "fecha_creacion");
                var aOrigenFilter = this.arrayItemsFunction(jsonOrigen, "origen");
                var aNombreEmpresaFilter = this.arrayItemsFunction(jsonNombreEmpresa, "nombre_empresa");

                //set filter items and labels
                oDialog.destroyFilterItems();
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "codigo_producto",
                    text: this._oBundle.getText("productID"),
                    items: aCodProdFilter
                }));
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "cod_interno",
                    text: this._oBundle.getText("internalID"),
                    items: aCodInternoFilter
                }));
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "fecha_creacion",
                    text: this._oBundle.getText("creationDate"),
                    items: aFechaCreacionFilter
                }));
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "origen",
                    text: this._oBundle.getText("origin"),
                    items: aOrigenFilter
                }));
                oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                    key: "nombre_empresa",
                    text: this._oBundle.getText("enterpriseID"),
                    items: aNombreEmpresaFilter
                }));
            }
            return oDialog;
        },

        duplicateFunction: function(jsonData, property) {
            jsonData = jsonData.filter(function(currentObject) {
                if (Object.values(currentObject)[0] in jsonData) {
                    return false;
                } else {
                    jsonData[Object.values(currentObject)[0]] = true;
                    return true;
                }
            });
            return jsonData;
        },

        arrayItemsFunction: function(jsonData, property) {
            var aItems = [];

            jsonData.forEach(function(currentObject) {
                var showText = "";

                // arreglando las view con formato de fecha dd/mm/yyyy fechas
                if (property === "fecha_creacion") {
                    showText = formatter.formatISODatetoLocaleDateString(Object.values(currentObject)[0]);
                } else {
                    showText = Object.values(currentObject)[0];
                }

                aItems.push(
                    new sap.m.ViewSettingsItem({
                        text: showText,
                        key: property
                    })
                );
            });

            return aItems;
        },

        onFilterDialogConfirm: function(oEvent) {
            var oTable = this.byId("idProductsTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                aFilters = [];
            mParams.filterItems.forEach(function(oItem) {
                var sPath = oItem.getKey(),
                    sOperator = FilterOperator.Contains,
                    sValue1 = oItem.getText();
                var oFilter = new sap.ui.model.Filter(sPath, sOperator, sValue1);
                aFilters.push(oFilter);
            });

            aFilters.forEach(element => {
                if (element.sPath === "fecha_creacion") {
                    // Pasar Fecha de dd/mm/yyyy a mm/dd/yyy
                    var dateParts = element.oValue1.split("/");
                    // month is 0-based, this's why we need dataParts[1] - 1
                    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                    // Pasar Fecha de mm/dd/yyy a formato ISO
                    element.oValue1 = dateObject.toISOString();
                }
            });

            oBinding.filter(aFilters);
        },

        onNavigateBack: function() {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRoute = sap.ui.core.UIComponent.getRouterFor(this);
                oRoute.navTo("RouteMain");
            }
        }
    });
});