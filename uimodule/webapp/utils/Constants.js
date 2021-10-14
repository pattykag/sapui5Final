sap.ui.define([], function() {
    "use strict";

    return {
        models: {
            model: "model",
            products: "modelProducts"
        },
        fragments: {
            dialogs: {
                dataDialog: "com.curso.final.fragments.Data",
                sortDialog: "com.curso.final.fragments.Sort",
                filterDialog: "com.curso.final.fragments.Filter"
            }
        }
    };
});