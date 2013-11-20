TipTip.module(
        "Views", function(Views, TipTip, Backbone, Marionette, $, _) {

    Views.Bill = Marionette.ItemView.extend({});

    Views.Bills = Marionette.CollectionView.extend({});

    Views.BillCreate = Marionette.ItemView.extend({});

    Views.Layout = Marionette.Layout.extend({});
});
