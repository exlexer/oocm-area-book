var db = require('../db/index.js')
var area = require('../db/area.js')
var rc = require('../db/rc.js')
var unit = require('../db/unit.js')
var dbUtils = require('../db/utils.js')

module.exports = function(app) {

	// Routes to get from and post to the stakes table in the db
	app.route('/stakes')
		.get(function (req, res) {
			db.query( 'SELECT * FROM stakes', (error, results) => { res.send(results)	})
		})
		.post(function (req, res) {
			db.query(
				"INSERT INTO stakes (name) VALUES (?)",
				req.body.name, (error, results) => {
					res.send(results)
			})
		})

	// Routes to get from and post to the units table in the db
	app.route('/units')
		.get(function (req, res) {
			db.query('SELECT * FROM units', (error, results) => {	res.send(results)	})
		})
		.post(function (req, res) {
			var data = req.body;
			db.query(
				"INSERT INTO units (name, stakeId) VALUES (?,?)",
				[data.name, data.stakeId], (error, results) => {
					res.send(results)
			})
		})

	app.route('/unitUpdate')
		.post(function (req, res) {
			var data = req.body;
			if (data.del) {
				unit.delete(data.id, (error, results) => {	res.send() })
			} else {
				unit.update(data.name, data.stakeId, data.id, (error, results) => { res.send()	})
			};
		})

	app.route('/rc')
		.get(function (req, res) {
			area.getRcs(req.session.passport.user,	(error, results) => {	res.send(results)	})
		})
		.post(function (req, res) {
			rc.update(req.body, (error, results) => { res.send() })
		})
}