var fs = require('fs')
var dbUtils = require('../db/utils.js')

module.exports = function(app) {

	app.route('/zones')
		.get((req, res) => {
			dbUtils.getZones((error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			dbUtils.newZone(req.body.name, req.body.stakeId, (error, results) => {
				res.send(results)
			})
		})

	app.route('/districts')
		.get((req, res) => {
			dbUtils.getDistricts((error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			if (req.body.update) {
				dbUtils.updateDistrict(req.body.zoneId, req.body.id, (error, results) => {
						res.send(results)
				})
			} else {
				dbUtils.newDistrict(req.body.name, req.body.zoneId, (error, results) => {
					res.send(results)
				})
			}
		})

	app.route('/areas')
		.get((req, res) => {
			dbUtils.getAreas((error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			var data = req.body;
			var units = Array.isArray(data.unitId) ? data.unitId : [data.unitId];
			if (!data.id) {
				dbUtils.newArea(data.name, data.phone, data.phoneTwo, data.districtId, units, (error, results) => {
					res.send()
				})
			} else {
				dbUtils.updateArea(data.name, data.phone, data.phoneTwo, data.districtId, units, data.id, (error, results) => {
					res.send()
				})
			};
		})

	app.route('/inv')
		.get((req, res) => {
			dbUtils.getInv(req.session.passport.user, (error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			dbUtils.updateInv(req.body, (error, results) => {
				res.send()
			})
		})

	app.route('/former')
		.get((req, res) => {
			dbUtils.getFormer(req.session.passport.user, (error, results) => {
				res.send(results)
			})
		})

	app.route('/lesson')
		.get((req, res) => {
			dbUtils.getLessons(req.session.passport.user, (error, results) => {
				res.send(results)
			})
		})

	app.route('/numbers')
		.post((req, res) => {
			// dbUtils.getAreaNums(req.session.passport.user, (nums) => {
				res.send()
			// })
			// if (req.body.leadership !== 'miss' || undefined) {
			// 	// get numbers for dominion
			// 	// dbUtils.getDominionNums
			// }
		})

	app.route('/miss')
		.get((req, res) => {
			dbUtils.getMissionaries((error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			if(req.body.id) {
				dbUtils.updateMissionary(req.body.name, req.body.email, req.body.leadership, req.body.areaId, req.body.id,
					(error, results) => {
						res.send(results)
					})
			} else {
				dbUtils.newMissionary(req.body.name, req.body.email, (error, results) => {
					res.send(results)
				})
			}
		})
}