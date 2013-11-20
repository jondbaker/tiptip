TipTip.module(
        "Views", function(Views, TipTip, Backbone, Marionette, $, _) {

    Views.Layout = Marionette.Layout.extend({
        template: "#layout-tpl",

        regions: {
            headerRegion: "#header-region",
            mainRegion: "#main-region"
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
        }
    });

    Views.Bills = Marionette.CollectionView.extend({
        itemView: Views.Bill,
        tagName: "table",
    });
});
