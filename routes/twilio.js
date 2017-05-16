'use strict';

var	twilioRoute = require('../twilio/index.js');
var dbUtils = require('../db/utils');

module.exports = function(app) {

	app.route('/message')
		.post(function (req, res) {
			var params = req.body.Body.split('! ');
			var action = params.shift().toLowerCase();
			dbUtils.findArea(req.body.From, function (error, results) {
				twilioRoute[action](params, results[0].id, function (error, response) {
					if (error) { console.error(error) };
					res.send(response);
				});
			});
		});
}