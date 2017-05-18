var dbUtils = require('../db/utils.js')
var authRoutes = require('./auth.js')
var churchRoutes = require('./church.js')
var ssRoutes = require('./ss.js')
var twilioRoutes = require('./twilio.js')
var missionRoutes = require('./mission.js')

module.exports = function(app) {

	authRoutes(app)
	churchRoutes(app)
	ssRoutes(app)
	twilioRoutes(app)
	missionRoutes(app)

	app.route('/user')
		.get((req, res) => {
			dbUtils.getUser(req.session.passport.user, (error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			if (req.body.newPassword) {
				dbUtils.checkPass(req.body.password, req.session.passport.user, () => {
					dbUtils.updateUser(req.body.name, req.body.email, req.body.newPassword, req.session.passport.user, (error, results) => {
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