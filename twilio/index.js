var db = require('../db/index')
var dbUtils = require('../db/utils')
var twilioUtils = require('./utils')


module.exports =  {
	ni: function (params, from, cb) {
		dbUtils.newInv(params[0], params[1], params[2], from, cb)
	},
	lessons: function (params, from, cb) {
		dbUtils.findInvOrRc(params[0], from,
		function (error, results) {
			if (error) { console.error('Error Finding Inv: ', error) }
			db.query(
				'INSERT INTO lessons (summary, lesson, invId) VALUES (?,?,?)',
				[params[1], params[2], results[0].id], cb)
		}, function (error, results) {
			if (error) { console.error('Error Finding Rc: ', error) }
			db.query(
				'INSERT INTO lessons (summary, lesson, rcId) VALUES (?,?,?)',
				[params[1], params[2], results[0].id], cb)
		})
	},
	ht: function (params, from, cb) {
		// insert hters names into recent converts
		dbUtils.findUnits(from, function (error, results) {
			console.log(params[1], results[0].unitId, params[0])
			db.query(
				'UPDATE rc SET hters = ? WHERE name = ? AND unitId = ?',
				[params[1], params[0], results[0].unitId],
				cb
			)
		})
	},
	vt: function (params, from, cb) {
		// insert vters names into recent converts
		dbUtils.findUnits(from, function (error, results) {
			if (error) { console.error('Error Finding Units: ', error) }
			db.query(
				'UPDATE rc SET vters = ? WHERE name = ? AND unitId = ?',
				[params[1], params[0], results[0].unitId],
				cb
			)
		})		
	},
	bap: function (params, from, cb) {
		dbUtils.findInv(params[0], from, function (error, results) {
			if (error) { console.error('Error Finding Inv: ', error) }
			dbUtils.bapInv(results[0], from, function (error, results) {
				if (error) { console.error('Error Saving Baptism: ', error) }
			})
		})
	},
	bd: function (params, from, cb) {
		// insert bd into inv
		dbUtils.findInv(params[0], from, function (error, results) {
			if (error) { console.error('Error Finding Inv: ', error) }
			db.query(
				'UPDATE inv SET bd = ? WHERE id = ?',
				[params[1], results[0].id],
				cb);
		})
	},
	temple: function (params, from, cb) {
		
	},
	church: function (params, from, cb) {
		// cycle through rest of params
		for (var i = 1; i < params.length; i++) {
			// add instance in church_attend as either RC or Inv
			dbUtils.findInvOrRc(params[i], from,
				function (error, results) {
					if (error) { console.error('Error Finding Inv: ', error) }
					dbUtils.invAtChurch(results[0].id, cb)
				}, function (error, results) {
					if (error) { console.error('Error Finding Rc: ', error) }
					dbUtils.rcAtChurch(results[0].id, cb);		
				})
			}
	},
	drop: function (params, from, cb) {
		dbUtils.findInv(params[0], from, function (error, results) {
			if (error) { console.error('Error Finding Inv: ', error) }
			dbUtils.dropInv(results[0], params[1], function (error, results) {
				if (error) { console.error('Error Dropping Inv: ', error) }
			})
		})
	},
	pickup: function (params, from, cb) {
		dbUtils.findFormer(params[0], from, function (error, results) {
				if (error) { console.error('Error Finding Former: ', error) }
			dbUtils.pickupInv(results[0], params[1], function (error, results) {
				if (error) { console.error('Error Picking Up Inv: ', error) }
				console.log(results);
			})
		})
	},
	commit: function (params, from, cb) {
		if (params[0]) {
			dbUtils.addCommitment(params[0], from, params[1], params[2], function (error, results) {
				if (error) { console.error('Error Saving Commitment: ', error) }
			})
		} else {
			dbUtils.getCommitments(from, function (error, results) {
				if (error) { console.error('Error Getting Commitments: ', error) }
				var message = '';
				for (var i = 0; i < results.length; i++) {
					message = message + results[i].name + ', ' + results[i].commitment + ', ' + results[i].followUp + '; ' 
				};
				cb(null, message)
				// send commitments
			})
		}
	}
}