/**
 * UploadController
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
		var fs = require('fs');

		fs.readFile(req.files.file.path, function(err, data) {
			var newPath = __dirname + '/../../uploads/start/'+req.files.file.name;
			fs.writeFile(newPath, data, function(err) {
				if(err) {
					res.json({'msg': err}, 500);
				}

				// @todo: remove the unlink function
				fs.unlink(newPath, function(err) {
					if(err) {
						console.log(err);
					}
				});
				res.json({'msg': 'OK'}, 200);
			});
		});
	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UploadController)
   */
  _config: {}
};
