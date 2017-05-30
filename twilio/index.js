var db = require('../db/index')
var dbUtils = require('../db/utils')
var inv = require('../db/inv')
var rc = require('../db/rc')
var lesson = require('../db/lesson')


module.exports =  {
	ni: function (params, from, cb) {
		inv.new(params[0], params[1], params[2], params[3], from, cb)
	},
	inv: function (params, from, cb) {
		if(params[0]) {
			inv.find(params[0], from, (error, results) => {
				var message = results[0].name + ', ' + results[0].address + ', ' + results[0].phoneNumber + ';'

				cb(null, message)				
			})
		} else {
			inv.getArea(from, (error, results) => {
					if (error) { console.error('Error Getting Commitments: ', error) }
					var message = '';
					for (var i = 0; i < results.length; i++) {
						message = message + results[i].name + '; '
					};
					cb(null, message)
			})
		}
	},
	lesson: function (params, from, cb) {
		dbUtils.findInvOrRc(params[0], from,
		(error, results) => {
			if (error) {
				console.error('Error Finding Inv: ', error)
			}
			db.query(
				'INSERT INTO lessons (summary, lesson, invId) VALUES (?,?,?)',
				[params[1], params[2], results[0].id],  (error, results) => cb(error, 'New Investigator Lesson Recieved'))
		}, (error, results) => {
			if (error) { console.error('Error Finding Rc: ', error) }
			if(!results.length) { 
				cb(null, "Sorry, I couldn't find any record of " + params[0])
			} else {
				db.query(
					'INSERT INTO lessons (summary, lesson, rcId) VALUES (?,?,?)',
					[params[1], params[2], results[0].id], (error, results) => cb(error, 'New Recent Convert Lesson Recieved'))
			}
		})
	},
	ht: function (params, from, cb) {
		// insert hters names into recent converts
		dbUtils.findUnits(from, (error, results) => {
			db.query(
				'UPDATE rc SET hters = ? WHERE name = ? AND unitId = ?',
				[params[1], params[0], results[0].unitId],
				(error, results) => cb(error, 'Home Teachers Recieved')
			)
		})
	},
	vt: function (params, from, cb) {
		// insert vters names into recent converts
		dbUtils.findUnits(from, (error, results) => {
			if (error) { console.error('Error Finding Units: ', error) }
			db.query(
				'UPDATE rc SET vters = ? WHERE name = ? AND unitId = ?',
				[params[1], params[0], results[0].unitId],
				(error, results) => cb(error, 'Visiting Teachers Recieved')
			)
		})		
	},
	bap: function (params, from, cb) {
		inv.find(params[0], from, (error, results) => {
			if (error) { console.error('Error Finding Inv: ', error) }
			inv.baptize(results[0], from, (error, results) => {
				if (error) { console.error('Error Saving Baptism: ', error) }
				cb(error, 'Congrats on the Baptism!')
			})
		})
	},
	bd: function (params, from, cb) {
		// insert bd into inv
		inv.find(params[0], from, (error, results) => {
			if (error) { console.error('Error Finding Inv: ', error) }
			db.query(
				'UPDATE inv SET bd = ? WHERE id = ?',
				[params[1], results[0].id],
				cb(error, 'Baptism Date Recieved'));
		})
	},
	temple: function (params, from, cb) {
	},
	church: function (params, from, cb) {
		// cycle through rest of params
		for (var i = 0; i < params.length; i++) {
			// add instance in church_attend as either RC or Inv
			dbUtils.findInvOrRc(params[i], from,
				(error, results) => {
					if (error) { console.error('Error Finding Inv: ', error) }
					inv.church(results[0].id, cb)
				}, (error, results) => {
					if (error) { console.error('Error Finding Rc: ', error) }
					rc.church(results[0].id, cb);		
				})
			}
	},
	drop: function (params, from, cb) {
		dbUtils.findInv(params[0], from, (error, results) => {
			if (error) { console.error('Error Finding Inv: ', error) }
			inv.drop(results[0], params[1], (error, results) => {
				if (error) { console.error('Error Dropping Inv: ', error) }
				(error, results) => cb(error, 'Investigator Dropped')
			})
		})
	},
	pickup: function (params, from, cb) {
		dbUtils.findFormer(params[0], from, (error, results) => {
				if (error) { console.error('Error Finding Former: ', error) }
			dbUtils.pickupInv(results[0], params[1], (error, results) => {
				if (error) { console.error('Error Picking Up Inv: ', error) }
				cb(error, 'Investigator Picked Up!')
			})
		})
	},
	commit: function (params, from, cb) {
		if (params[0]) {
			dbUtils.addCommitment(params[0], from, params[1], params[2], (error, results) => {
				if (error) { console.error('Error Saving Commitment: ', error) }
				cb(error, 'Commitment Recieved')
			})
		} else {
			dbUtils.getCommitments(from, (error, results) => {
				if (error) { console.error('Error Getting Commitments: ', error) }
				var message = ''
				for (var i = 0; i < results.length; i++) {
					message = message + results[i].name + ', ' + results[i].commitment + ', ' + results[i].followUp + '; ' 
				}

				cb(null, message)
			})
		}
	},
	followup: function (params, from, cb) {
		dbUtils.followUp(params[0], params[1], from, (error, results) => {
			if (error) { console.error('Error Following Up: ', error) }
			cb(error, 'Way to Follow Up!')
		})
	}

}