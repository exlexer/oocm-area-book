var	twilioRoute = require('../twilio/index.js')
var dbUtils = require('../db/utils')

module.exports = function(app) {

function resendText (text, from) {
var params = text.split('! ')
  dbUtils.findArea(from, (error, results) => {
    var action = params.shift().toLowerCase()
    twilioRoute[action](params, results[0].id, (error, response) => {
      if (error) { console.error(error) }
			console.log(response)
    })
  })
}

resendText("lesson! Merlin Johnson! Taught DoC and shared a lot of experiences. He still doesnt thing theres only one church! 3", '+19402245103');
resendText("Lesson! Luke Noel! Read alma 32 with him. He really connect with the humility part. Wants to keep meeting with us and will read. Left Ether 12", '+19402245103');






	app.route('/message')
		.post((req, res) => {
			var params = req.body.Body.split('! ')
			dbUtils.findArea(req.body.From, (error, results) => {
				var action = params.shift().toLowerCase()
				twilioRoute[action](params, results[0].id, (error, response) => {
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