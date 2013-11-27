TipTip.module(
        "Views", function(Views, TipTip, Backbone, Marionette, $, _) {

    Views.Layout = Marionette.Layout.extend({
        template: "#layout-tpl",

        regions: {
            headerRegion: "#header-region",
            messageRegion: "#message-region",
            mainRegion: "#main-region",
            footerRegion: "#footer-region"
        }
    });

    Views.BillCreate = Marionette.ItemView.extend({
        template: "#bill-create-tpl",

        ui: {
            billCreate: "input#bill-create",
            inputClear: "span#js-input-clear"
        },

        events: {
            "keydown #bill-create": "onInputKeydown",
            "keyup #bill-create": "onInputKeyup",
            "click #js-input-clear": "onInputClear"
        },

        onInputClear: function() {
            if (this.ui.billCreate.val().length > 0) {
                this.ui.billCreate.val("");
                this.onInputKeypress();
            }
        },

        onInputInvalid: function() {
            $(this.ui.billCreate).addClass("error");
        },

        onInputKeydown: function(e) {
            if (e.which === 13) {  // ENTER
                this.ui.billCreate.blur();
                e.preventDefault();
            }
        },

        onInputKeyup: function(e) {
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
            }, 3000);
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
        template: "#bills-composite-tpl"
    });

    Views.Message = Marionette.ItemView.extend({
        tagName: "p",
        template: "#message-tpl",

        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        }
    });

    Views.Panel = Backbone.View.extend({
        template: "#bill-panel-tpl",

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
            var template = _.template($(this.template).html(), {
                avgAmount: TipTip.Models.Bill.formatMoney(this.avgAmount),
                avgPercentage: this.avgPercentage.toFixed(2) + "%" 
            });
            this.$el.html(template);
            return this;
        }
    });
});
