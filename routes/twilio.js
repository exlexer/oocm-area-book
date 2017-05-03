'use strict';

var	twilioRoute = require('../twilio/index.js');

module.exports = function(app) {

	app.route('/message')
		.post(function (req, res) {
			twilioRoute(req.body.From, req.body.Body, function (error, results) {
				if (error) { console.log(error) };
				res.send();
			});
		});
}