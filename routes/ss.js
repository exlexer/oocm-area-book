'use strict';

var ssUtils = require('../sheets/utils.js');

module.exports = function(app) {

	app.route('/exportStake')
		.post(function (req, res) {
			ssUtils.exportRc(req.body.id, function (url) {
				if(!res._header) {
					res.send({ url : url });
				};
			})
		});

	app.route('/redirectOAuth')
		.get(function (req, res) {
			ssUtils.storeToken(req.query['code']);
			res.send();
		});

	app.route('/authGoogle')
		.post(function (req, res) {
			ssUtils.getToken(req.body.authCode, req.body.client, function(client) {
				res.send();
			})
		})
}