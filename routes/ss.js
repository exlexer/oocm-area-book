'use strict';

var ssUtils = require('../sheets/utils.js');

module.exports = function(app) {

	app.route('/exportStake')
		.post(function (req, res) {
			ssUtils.exportRc(req.body.id, function (url) {
				res.send({ url : url, success : true });
			}, function (url, client) {
				res.send({ url : url, success : false, client : client });
			})
		});

	app.route('/redirectOAuth')
		.get(function (req, res) {
			console.log(req);
		});

	app.route('/authGoogle')
		.post(function (req, res) {
			ssUtils.getToken(req.body.authCode, req.body.client, function(client) {
				res.send();
			})
		})

}