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
		})
		.post(function (req, res) {
			if (req.body.newPassword) {
				dbUtils.checkPass(req.body.password, req.session.passport.user, function () {
					dbUtils.updateUser(req.body.name, req.body.email, req.body.newPassword, req.session.passport.user, function (error, results) {
						res.send('Password Correct!');
					})
				}, function () {
					res.send('Password Incorrect!');
				});
			} else {
				res.send('no password!');
			}
		});
}