'use strict';

var fs = require('fs'),
		dbUtils = require('../db/utils.js');

module.exports = function(app) {

	app.route('/zones')
		.get(function (req, res) {
			dbUtils.getZones(function (error, results) {
				res.send(results);
			});
		})
		.post(function (req, res) {
			dbUtils.newZone(req.body.name, req.body.stakeId, function (error, results) {
				res.send(results);
			});
		});

	app.route('/districts')
		.get(function (req, res) {
			dbUtils.getDistricts(function (error, results) {
				res.send(results);
			});
		})
		.post(function (req, res) {
			if (req.body.update) {
				dbUtils.updateDistrict(req.body.zoneId, req.body.id, function (error, results) {
						res.send(results);
				});
			} else {
				dbUtils.newDistrict(req.body.name, req.body.zoneId, function (error, results) {
					res.send(results);
				});
			}
		});

	app.route('/areas')
		.get(function (req, res) {
			dbUtils.getAreas(function (error, results) {
				res.send(results);
			});
		})
		.post(function (req, res) {
			var data = req.body;
			var units = Array.isArray(data.unitId) ? data.unitId : [data.unitId];
			if (!data.id) {
				dbUtils.newArea(data.name, data.phone, data.phoneTwo, data.districtId, units, function (error, results) {
					res.send();
				});
			} else {
				dbUtils.updateArea(data.name, data.phone, data.phoneTwo, data.districtId, units, data.id, function (error, results) {
					res.send();
				});
			};
		});

	app.route('/inv')
		.get(function (req, res) {
			dbUtils.getInv(req.session.passport.user, function (error, results) {
				res.send(results);
			})
		})
		.post(function (req, res) {
			dbUtils.updateInv(req.body, function (error, results) {
				res.send();
			})
		});

	app.route('/former')
		.get(function (req, res) {
			dbUtils.getFormer(req.session.passport.user, function (error, results) {
				res.send(results);
			})
		})

	app.route('/lesson')
		.get(function (req, res) {
			dbUtils.getLessons(req.session.passport.user, function (error, results) {
				res.send(results);
			})
		});

	app.route('/numbers')
		.post(function (req, res) {
			dbUtils.getAreaNums(req.session.passport.user,	function (nums) {
				res.send(nums)
			});
			// if (req.body.leadership !== 'miss' || undefined) {
			// 	// get numbers for dominion
			// 	// dbUtils.getDominionNums
			// }
		});

	app.route('/miss')
		.get(function (req, res) {
			dbUtils.getMissionaries(function (error, results) {
				res.send(results);
			});
		})
		.post(function (req, res) {
			if(req.body.id) {
				dbUtils.updateMissionary(req.body.name, req.body.email, req.body.leadership, req.body.areaId, req.body.id,
					function (error, results) {
						console.log(results);
						res.send(results);
					})
			} else {
				dbUtils.newMissionary(req.body.name, req.body.email, function (error, results) {
					res.send(results);
				});
			}
		});
}