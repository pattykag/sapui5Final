sap.ui.define([
    "com/curso/final/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/curso/final/utils/Constants",
    'sap/m/MessageToast',
    "sap/ui/unified/DateTypeRange"
], function(Controller, JSONModel, Constants, MessageToast, DateTypeRange) {
    "use strict";

    return Controller.extend("com.curso.final.controller.Main", {
        onInit: function() {
            this.loadModel();

            this._oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        loadModel: function() {
            const oModel = new JSONModel({
                name: "",
                lastname: "",
                dni: "",
                birthdate: ""
            });
            this.getOwnerComponent().setModel(oModel, Constants.models.model);
        },

        onPressSave: function() {
            // La validación quizás no es la más óptima pero es para ahorrar tiempo

            let name = this.byId("inputName").getValue();
            //Validación Nombre
            if (!isNaN(name)) {
                name = name.length > 0 ? parseFloat(name) : 0;
                if (typeof name != 'string') {
                    MessageToast.show(this._oBundle.getText("nameNotValid"));
                    this.byId("inputName").setValue("");
                    return;
                }
            }

            let lastname = this.byId("inputLastname").getValue();
            //Validación Apellido
            if (!isNaN(lastname)) {
                lastname = lastname.length > 0 ? parseFloat(lastname) : 0;
                if (typeof lastname != 'string') {
                    MessageToast.show(this._oBundle.getText("lastnameNotValid"));
                    this.byId("inputLastname").setValue("");
                    return;
                }
            }

            let dni = this.byId("inputDni").getValue();

            //Validación DNI
            dni = dni.length > 0 ? parseFloat(dni) : 0;
            if (isNaN(dni)) {
                MessageToast.show(this._oBundle.getText("dniNotValid"));
                this.byId("inputDni").setValue("");
                return;
            }

            let birthdate = this.byId("inputBirthdate").getValue();
            //Validación birthdate
            if (birthdate.length < 1) {
                MessageToast.show(this._oBundle.getText("birthdateNotValid"));
                this.byId("inputBirthdate").setValue("");
                return;
            }

            let model = this.getView().getModel(Constants.models.model);

            model.setProperty("/name", name);
            model.setProperty("/lastname", lastname);
            model.setProperty("/dni", dni);
            model.setProperty("/birthdate", birthdate);

            let oData = model.oData;
            let msg = `${this._oBundle.getText("name")}: ${oData.name}, ${this._oBundle.getText("lastname")}: ${oData.lastname}, ${this._oBundle.getText("dni")}: ${oData.dni}, ${this._oBundle.getText("birthdate")}: ${oData.birthdate}`
            MessageToast.show(msg);

            //Panel
            this.byId("buttonModel").setVisible(true);
            this.byId("buttonDialog").setVisible(true);
        },

        onModelPress: function() {
            if (!this.Dialog) {
                this.Dialog = sap.ui.xmlfragment(
                    "idData",
                    Constants.fragments.dialogs.dataDialog,
                    this
                );
                this.getView().addDependent(this.Dialog);
            }
            this.Dialog.open();
        },

        onCloseDataDialog: function() {
            this.Dialog.close();
        },

        onSecondView: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TableView");
        }

    });
});