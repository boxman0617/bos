'use strict';
/* global $, Dash, App, DashTest, jDepend, io */

$(function(){
	Dash.init();
	
	App.init(jDepend, io);
	App.ready(function() {
		// TEST
		DashTest.init(Dash);
	});
});