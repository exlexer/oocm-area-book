var ss = require('./index.js');
var twilio = require('twilio');


// Creates new sheet, accepts a title for the sheet and a callback taking params of err and response
module.exports = {
	respond: function(message) {
		var twiml = new twilio.TwimlResponse();
  	twiml.message(message);
  	return twiml.toString();
	}
};
