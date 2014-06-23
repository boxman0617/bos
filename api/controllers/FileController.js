/**
 * FileController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	'start': function(req, res) {
		res.json({'status': 'OK'}, 200);
	},

	'getValidationMatrices': function(req, res) {
		
	},

	'startTracking': function(req, res) {
		res.json({'msg': 'Uhhh...'}, 200);

		setTimeout(function() {
			req.socket.emit('message', 'success');
			setTimeout(function() {
				res.socket.emit('message', 'success');
				setTimeout(function() {
					res.socket.emit('message', 'check');
				}, 2000);
			}, 2000);
		}, 2000);
	},

	'validationAccepted': function(req, res) {
		res.json(true, 200);

		setTimeout(function() {
			req.socket.emit('message', 'success');
			setTimeout(function() {
				res.socket.emit('message', 'check');
			}, 2000);
		}, 2000);
	}
};
