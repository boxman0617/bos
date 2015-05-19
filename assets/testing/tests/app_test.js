var should = chai.should();
var expect = chai.expect;

describe('App', function() {
	describe('#init', function() {
		it('should set Socket.IO internally', function() {
			expect(App._io).to.not.equal(null);
		});
	});

	describe('#loading', function() {
		it('should start page loading and display the loading screen', function() {
			App.createPageLoadingComponents();
			expect($('#pageload').length).to.equal(1);

			App.startPageLoad();
			expect(App._loading).to.equal(true);

			App.ready(function() {
				expect(App._loading).to.equal(false);
				expect($('#pageload').length).to.equal(0);
			});

			App.endPageLoad();
		});
	});

	describe('#IECompat', function() {
		it('Array should have indexOf method', function() {
			console.log(Array.prototype.indexOf);
			expect(Array.prototype.indexOf).to.not.equal(false);
		});
	});
});