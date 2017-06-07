var dbUtils = require('../db/utils.js')
var authRoutes = require('./auth.js')
var churchRoutes = require('./church.js')
var ssRoutes = require('./ss.js')
var twilioRoutes = require('./twilio.js')
var missionRoutes = require('./mission.js')
var user = require('../db/user')

module.exports = function(app) {

	authRoutes(app)
	churchRoutes(app)
	ssRoutes(app)
	twilioRoutes(app)
	missionRoutes(app)

	app.route('/user')
		.get((req, res) => {
			user.get(req.session.passport.user, (error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			if (req.body.newPassword) {
				user.check(req.body.password, req.session.passport.user, () => {
					user.update(req.body.name, req.body.email, req.body.newPassword, req.session.passport.user, (error, results) => {
						res.send('Password Correct!')
					})
				}, () => {
					res.send('Password Incorrect!')
				})
			} else {
				res.send('no password!')
			}
		})
}