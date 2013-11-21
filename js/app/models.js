TipTip.module(
        "Models", function(Models, TipTip, Backbone, Marionette, $, _) {
    
    Models.Bill = Backbone.Model.extend({
        urlRoot: "bills",

        // Recalculate 'tipAmount' whenever 'amount' changes
        initialize: function() {
            this.on("change", function() {
                if (this.changed.hasOwnProperty("amount") &&
                        this.changed.amount !== null) {
                    var amount = parseFloat(
                        this.changed.amount.replace(",", ""));
                    this.set({
                        tipAmount: amount * this.get("tipPercentage") / 100.0});
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
    Models.Bill.formatMoney = function(val) {
        return "$" + (Math.ceil(val * 100) / 100).toFixed(2);
    }
    Models.configureStorage(Models.Bill);

    Models.Bills = Backbone.Collection.extend({
        model: Models.Bill,
        url: "bills"
    });
    Models.configureStorage(Models.Bills);

    var API = {
        getBills: function() {
            var bills = new Models.Bills();
            var defer = $.Deferred();
            bills.fetch({
                success: function(data) {
                    defer.resolve(data);
                }
            });
            return defer.promise();
        }
    }

    TipTip.reqres.setHandler("bill:models", function() {
        return API.getBills();
    });
});
