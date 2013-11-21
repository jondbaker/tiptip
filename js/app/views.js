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

        onFlash: function() {
            var that = this;
            that.$el.addClass("success");
            setTimeout(function() {
                that.$el.removeClass("success");
            }, 2000);
        },

        templateHelpers: function() {
            return {
                formatMoney: function(val) {
                    return TipTip.Models.Bill.formatMoney(val);
                }
            };
        }
    });

    Views.Bills = Marionette.CompositeView.extend({
        itemView: Views.Bill,
        itemViewContainer: "tbody",
        template: "#bills-composite-tpl",

        ui: {
            selectHelp: "p#select-help"
        },

        onCompositeRendered: function() {
            if (window.innerWidth > 768) {
                $(this.ui.selectHelp).text("* Tap a tip to select it");
            } else {
                $(this.ui.selectHelp).text("* Click a tip to select it");
            }
        }
    });

    Views.Panel = Backbone.View.extend({

        events: {
            "click #js-history-clear": "clearHistoryClick"
        },

        _calculateStats: function() {
            this.avgAmount = 0.0;
            this.avgPercentage = 0.0;

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

        clearHistoryClick: function(e) {
            e.preventDefault(); 
            this.trigger("history:clear");
        },

        initialize: function() {
            this.listenTo(this.collection, "remove", this.render);
            this.listenTo(this.collection, "add", this.render);
        },

        render: function() {
            this._calculateStats();
            var template = _.template($("#bill-panel-tpl").html(), {
                avgAmount: TipTip.Models.Bill.formatMoney(this.avgAmount),
                avgPercentage: this.avgPercentage.toFixed(2) + "%" 
            });
            this.$el.html(template);
            return this;
        }
    });
});
