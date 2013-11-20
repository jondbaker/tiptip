TipTip.module("Models", function(Models, TipTip, Backbone, Marionette, $, _) {

    var getStorageKey = function(model) {
        // use models 'urlRoot' property
        if (model.urlRoot) {
            return _.result(model, "urlRoot");
        }

        // use collections 'url' property
        if (model.url) {
            return _.result(model, "url");
        }

        // fallback to obtaining a model's storage key from the collection it
        // belongs to
        if (model.collection && model.collection.url) {
            return _.result(model.collection, "url");
        }

        throw new Error("Unable to determine storage key");
    }

    var StorageMixin = function(modelPrototype) {
        var storageKey = getStorageKey(modelPrototype);
        return { localStorage: new Backbone.LocalStorage(storageKey) };
    };

    Models.configureStorage = function(model) {
        _.extend(model.prototype, new StorageMixin(model.prototype));
    };
});
