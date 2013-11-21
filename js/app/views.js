TipTip.module(
        "Views", function(Views, TipTip, Backbone, Marionette, $, _) {

    Views.Layout = Marionette.Layout.extend({
        template: "#layout-tpl",

        regions: {
            headerRegion: "#header-region",
            mainRegion: "#main-region",
            footerRegion: "#footer-region"
        }
    });

    Views.BillCreate = Marionette.ItemView.extend({
        template: "#bill-create-tpl",

        ui: {
            billCreate: "input#bill-create"
        },

        events: {
            "keyup #bill-create": "onInputKeypress"
        },

        onInputInvalid: function() {
            $(this.ui.billCreate).addClass("error");
        },

        onInputKeypress: function() {
            this.trigger("bill-create:keypress", this.ui.billCreate.val());
        },

        onInputReset: function() {
            $(this.ui.billCreate).removeClass("error");
        }
    });

    Views.Bill = Marionette.ItemView.extend({
        tagName: "tr",
        template: "#bill-item-tpl",

        events: {
            "click": "onClick"
        },

        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },

        onClick: function() {
            this.trigger("bill:save", this.model);
        },

        templateHelpers: function() {
            return {
                formatMoney: function(val) {
                    return TipTip.Models.Bill.formatMoney(val);
                }
            };
        }
    });

    Views.Bills = Marionette.CollectionView.extend({
        itemView: Views.Bill,
        tagName: "table",
    });

    Views.Stats = Backbone.View.extend({

        initialize: function() {
            this.totalAmount = 0.0;
            this.totalPercentage = 0.0;
        },

        _calculateStats: function() {
            if (this.collection.length > 0) {
                var totalAmount = 0.0,
                    totalPercentage = 0.0;

                this.collection.forEach(function(bill) {
                    totalAmount += bill.get("tipAmount");
                    totalPercentage += bill.get("tipPercentage");
                });

                this.avgAmount = totalAmount / this.collection.length;
                this.avgPercentage = totalPercentage / this.collection.length;
            }
        },

        render: function() {
            this._calculateStats();
            var template = _.template($("#bill-stats-tpl").html(), {
                avgAmount: TipTip.Models.Bill.formatMoney(this.avgAmount),
                avgPercentage: this.avgPercentage 
            });
            this.$el.html(template);
        }
    });
});
