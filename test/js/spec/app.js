describe("App", function() {
    it("provides the 'TipTip' object", function() {
        expect(TipTip).to.be.an("object");
        expect(TipTip).to.include.keys("appRegion");
    });

    it("binds a callback to the 'initialize:after' event", function() {
        expect(TipTip).to.include.keys("_events");
        expect(TipTip._events).to.include.keys("initialize:after");
        expect(TipTip._events["initialize:after"][0]).to.include.keys("callback");
    });
});
