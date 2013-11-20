TipTip.module(
        "Models", function(Models, TipTip, Backbone, Marionette, $, _) {
    
    Models.Bill = Backbone.Model.extend({

        // Recalculate 'tipAmount' whenever 'amount' changes
        initialize: function() {
            this.on("change", function() {
                if (this.changed.hasOwnProperty("amount")) {
                    var amount = parseFloat(
                        this.changed.amount.replace(",", ""));
                    var tip = amount * this.get("tipPercentage") / 100.0;
                    this.set({
                        tipAmount: (Math.ceil(tip * 100) / 100).toFixed(2)});
                }
            });
        },

        // Validate 'amount' attribute
        validate: function(attrs) {
            var val = attrs.amount,
                valid = true;

            if (val.length === 0) {
                valid = false;
            } else if (val.length === 1) {
                valid = (val.search(/^\d$/) >= 0);
            } else {
                valid = (val.search(/^\.([\d]{1,2})$/) >= 0 ||
                        val.search(/^\d+(,\d{3})*(\.\d{1,2})?$/) >= 0);
            }

            if (!valid) {
                return "ERROR";
            }
        }
    });

    Models.Bills = Backbone.Collection.extend({
        model: Models.Bill
    });
});
