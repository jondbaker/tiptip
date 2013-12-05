TipTip = new Marionette.Application();

TipTip.addRegions({
    appRegion: "#app-region"
});

TipTip.on("initialize:after", function() {
    var controller = new this.Controllers.Bill();
    controller.start();
});
