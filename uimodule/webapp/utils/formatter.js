sap.ui.define([], function() {
    "use strict";
    return {
        formatISODatetoLocaleDateString: function(sDate) {
            return new Date(sDate).toLocaleDateString('es-AR');
        },

        statusColor: function(cod_interno) {
            cod_interno = parseFloat(cod_interno);
            if (cod_interno === 1000) {
                return "Error";
            } else if (cod_interno === 2000) {
                return "Warning";
            } else if (cod_interno === 3000) {
                return "Success";
            }
        }
    };
});