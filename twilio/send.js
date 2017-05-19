var twilio = require('twilio')
// var client = twilio('AC235215a0f4a20059fdcc2ff471231bbd','d935cfd1a503c95e8b454efe53eedd60')
var client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)

module.exports = (number, message, cb) => {
	client.messages.create({ 
  	to: number,
  	from: "+14058966130", 
  	body: message, 
	}, cb)
}
