'use strict';

var dbUtils = require('../db/utils.js'),
		authRoutes = require('./auth.js'),
		churchRoutes = require('./church.js'),
		ssRoutes = require('./ss.js'),
		twilioRoutes = require('./twilio.js'),
		missionRoutes = require('./mission.js');

module.exports = function(app) {

	authRoutes(app);
	churchRoutes(app);
	ssRoutes(app);
	twilioRoutes(app);
	missionRoutes(app);

	app.route('/user')
		.get(function (req, res) {
			dbUtils.getUser(req.session.passport.user, function (error, results) {
				res.send(results);
			});
		});
}