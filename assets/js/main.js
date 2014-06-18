$(function(){
	Dash.init();
	
	App.init(jDepend, io);
	App.ready(function() {
		// TEST
		DashTest.init(Dash);
	});
});