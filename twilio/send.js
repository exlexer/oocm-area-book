var twilio = require('twilio')
var client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)

module.exports = (number, message, cb) => {
	client.messages.create({ 
  	to: number,
  	from: "+14058966130", 
  	body: message, 
	}, cb)
}
