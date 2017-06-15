var fs = require('fs')
var dbUtils = require('../db/utils.js')
var inv = require('../db/inv.js')
var former = require('../db/former.js')
var lesson = require('../db/lesson.js')
var miss = require('../db/miss.js')
var user = require('../db/user.js')
var area = require('../db/area.js')
var zone = require('../db/zone.js')
var district = require('../db/district.js')

module.exports = function(app) {

	app.route('/zones')
		.get((req, res) => {
			zone.get((error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			zone.new(req.body.name, req.body.stakeId, (error, results) => {
				res.send(results)
			})
		})

	app.route('/districts')
		.get((req, res) => {
			district.get((error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			if (req.body.update) {
				district.update(req.body.zoneId, req.body.id, (error, results) => {
						res.send(results)
				})
			} else {
				district.new(req.body.name, req.body.zoneId, (error, results) => {
					res.send(results)
				})
			}
		})

	app.route('/areas')
		.get((req, res) => {
			area.get((error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			var data = req.body;
			var units = Array.isArray(data.unitId) ? data.unitId : [data.unitId];
			if (!data.id) {
				area.new(data.name, data.phone, data.phoneTwo, data.districtId, units, (error, results) => {
					res.send()
				})
			} else {
				area.update(data.name, data.phone, data.phoneTwo, data.districtId, units, data.id, (error, results) => {
					res.send()
				})
			};
		})

	app.route('/inv')
		.get((req, res) => {
			inv.get(req.session.passport.user, (error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			inv.update(req.body, (error, results) => {
				res.send()
			})
		})

	app.route('/former')
		.get((req, res) => {
			former.get(req.session.passport.user, (error, results) => {
				res.send(results)
			})
		})

	app.route('/lesson')
		.get((req, res) => {
			lesson.get(req.session.passport.user, (error, results) => {
				res.send(results)
			})
		})

	app.route('/numbers')
		.post((req, res) => {
			user.get(req.session.passport.user, (error, results) => {
				area.getNums(results[0].areaId, null, null, (nums) => {
					res.send(nums)
				
			})
			// })
			// if (req.body.leadership !== 'miss' || undefined) {
			// 	// get numbers for dominion
			// 	// dbUtils.getDominionNums
			})
		})

	app.route('/miss')
		.get((req, res) => {
			miss.get((error, results) => {
				res.send(results)
			})
		})
		.post((req, res) => {
			if(req.body.id) {
				miss.update(req.body.name, req.body.email, req.body.leadership, req.body.areaId, req.body.id,
					(error, results) => {
						res.send(results)
					})
			} else {
				miss.new(req.body.name, req.body.email, (error, results) => {
					res.send(results)
				})
			}
		})
}