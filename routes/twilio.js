var	twilioRoute = require('../twilio/index.js')
var dbUtils = require('../db/utils')

module.exports = function(app) {

	app.route('/message')
		.post((req, res) => {
			var params = req.body.Body.split('! ')
			dbUtils.findArea(req.body.From, (error, results) => {
				var action = params.shift().toLowerCase()
				twilioRoute[action](params, results[0].id, req.body.From, (error, response) => {
					if (error) { console.error(error) }
					if (response) {	
						var twiml = new twilio.TwimlResponse()
				  	twiml.message(response)
				  	response = twiml.toString()
					}
					res.send(response)
				})
			})
		})
}