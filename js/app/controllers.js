TipTip.module(
        "Controllers",
        function(Controllers, TipTip, Backbone, Marionette, $, _) {

    Controllers.Bill = Marionette.Controller.extend({
        _createFreshBills: function(count, incrementor) {
            this.freshCollection = new TipTip.Models.Bills();
            for (var i = 1; i <= count; i++) {
                this.freshCollection.add({
                    amount: null,
                    tipAmount: null,
                    tipPercentage: i * incrementor
                });
            }
        },

        _getStaleBills: function() {
        },

        initialize: function() {
            this._createFreshBills(5, 5);
        },

        start: function() {
            var that = this;
            var layout = new TipTip.Views.Layout(),
                billCreateView = new TipTip.Views.BillCreate(),
                billsView = new TipTip.Views.Bills(
                    { collection: this.freshCollection });

            // get persisted models
            var fetchingBills = TipTip.request("bill:models");
            $.when(fetchingBills).done(function(bills) {
                var statsView = new TipTip.Views.Stats(
                    { collection: bills });

                // event handler
                billCreateView.on("bill-create:keypress", function(amount) {
                    billCreateView.triggerMethod("input:reset");
                    if (amount.length > 0) {
                        if (amount.length === 1 && amount.charAt(0) === ".") {
                            return;
                        }
                        that.freshCollection.forEach(function(bill) {
                            if (!bill.set({amount: amount}, {validate: true})) {
                                billCreateView.triggerMethod("input:invalid");
                                return;
                            }
                        });
                    }
                });

                // event handler
                billsView.on("itemview:bill:save", function(childView, model) {
                    if (model.save()) {
                        childView.$el.addClass("success");
                    } else {
                        billCreateView.triggerMethod("input:invalid");
                    }
                });

                layout.on("show", function() {
                    layout.headerRegion.show(billCreateView);
                    layout.mainRegion.show(billsView);
                    layout.footerRegion.show(statsView);
                });

                TipTip.appRegion.show(layout);

            });
        }
    });
});
