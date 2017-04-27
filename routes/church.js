'use strict';

var db = require('../db/index.js'),
		dbUtils = require('../db/utils.js');

module.exports = function(app) {

	// Routes to get from and post to the stakes table in the db
	app.route('/stakes')
		.get(function (req, res) {
			db.query(
				'SELECT * FROM stakes',
				function (error, results, fields) {
					res.send(results);
			});
		})
		.post(function (req, res) {
			db.query(
				"INSERT INTO stakes (name) VALUES (?)",
				req.body.name,
				function (error, results, fields) {
					res.send(results);
			});
		});




	// Routes to get from and post to the units table in the db
	app.route('/units')
		.get(function (req, res) {
			db.query('SELECT * FROM units', function (error, results, fields) {
				res.send(results);
			});
		})
		.post(function (req, res) {
			var data = req.body;
			db.query(
				"INSERT INTO units (name, stakeId) VALUES (?,?)",
				[data.name, data.stakeId],
				function (error, results, fields) {
					res.send(results);
			});
		});

	app.route('/unitUpdate')
		.post(function (req, res) {
			var data = req.body;
			if (data.del) {
				dbUtils.deleteUnit(data.id, function (error, results) {	
					res.send()
				});
			} else {
				dbUtils.updateUnit(data.name, data.stakeId, data.id, function (error, results) {
					res.send();
				});
			};
		})

	app.route('/rc')
		.get(function (req, res) {
			dbUtils.getAreaRcs(req.session.passport.user,
				function (error, results, fields) {
					res.send(results);
				})
		});

}