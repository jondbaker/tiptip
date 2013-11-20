TipTip.module(
        "Models", function(Models, TipTip, Backbone, Marionette, $, _) {
    
    Models.Bill = Backbone.Model.extend({});

    Models.Bills = Backbone.Collection.extend({
        model: Models.Bill
    });
});
