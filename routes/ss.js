'use strict'

var ssUtils = require('../sheets/utils.js')

module.exports = function(app) {

	app.route('/exportStake')
		.post((req, res) => {
			ssUtils.exportRc(req.body.id, (url) => {
				if(!res._header) {
					res.send({ url : url })
				};
			})
		})

	app.route('/redirectOAuth')
		.get((req, res) => {
			console.log(req.query['code'])
			ssUtils.storeToken(req.query['code'])
			res.send()
		})

	// This seems to be depricated
	app.route('/authGoogle')
		.post((req, res) => {
			ssUtils.getToken(req.body.authCode, req.body.client, (client) => {
				res.send()
			})
		})
}