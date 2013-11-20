TipTip.module(
        "Controllers",
        function(Controllers, TipTip, Backbone, Marionette, $, _) {

    Controllers.Bill = Marionette.Controller.extend({
        _createBills: function(count, incrementor) {
            this.collection = new TipTip.Models.Bills();
            for (var i = 1; i <= count; i++) {
                this.collection.add({
                    amount: null,
                    tipAmount: null,
                    tipPercentage: i * incrementor
                });
            }
        },

        initialize: function() {
            this._createBills(5, 5);
        },

        start: function() {
            var that = this;
            var layout = new TipTip.Views.Layout(),
                billCreateView = new TipTip.Views.BillCreate(),
                billsView = new TipTip.Views.Bills(
                    { collection: this.collection });

            billCreateView.on("bill-create:keypress", function(amount) {
                billCreateView.triggerMethod("input:reset");
                if (amount.length > 0) {
                    if (amount.length === 1 && amount.charAt(0) === ".") {
                        return;
                    }
                    that.collection.forEach(function(bill) {
                        if (!bill.set({amount: amount}, {validate: true})) {
                            billCreateView.triggerMethod("input:invalid");
                            return;
                        }
                    });
                }
            });

            billsView.on("itemview:bill:save", function(childView, model) {
                if (model.save()) {
                    childView.$el.addClass("success");
                } else {
                    billCreateView.triggerMethod("input:invalid");
                }
            });

            layout.on("show", function() {
                layout.headerRegion.show(billCreateView);
                layout.mainRegion.show(billsView)
            });

            TipTip.appRegion.show(layout);
        }
    });
});
