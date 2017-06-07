var db = require('../db/index')
var dbUtils = require('../db/utils')
var inv = require('../db/inv')
var rc = require('../db/rc')
var unit = require('../db/unit')
var lesson = require('../db/lesson')
var former = require('../db/former')
var commit = require('../db/commit')

// Functions are run as first parameter of an incoming text
module.exports =  {

	// Creates a new investigator
	ni: function (params, from, cb) {
		inv.new(params[0], params[1], params[2], params[3], from, cb)
	},

	// Responds with a list of investigators or the info from a specific investigator, depending on parameters
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

	// Creates a lesson for an Investigator or a Recent Convert
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

	// Adds Home Teachers into Recent Convert
	ht: function (params, from, cb) {
		unit.find(from, (error, results) => {
			db.query(
				'UPDATE rc SET hters = ? WHERE name = ? AND unitId = ?',
				[params[1], params[0], results[0].unitId],
				(error, results) => cb(error, 'Home Teachers Recieved')
			)
		})
	},

	// Adds Visiting Teachers into Recent converts, as of right now it does not check gender
	vt: function (params, from, cb) {
		// insert vters names into recent converts
		unit.find(from, (error, results) => {
			if (error) { console.error('Error Finding Units: ', error) }
			db.query(
				'UPDATE rc SET vters = ? WHERE name = ? AND unitId = ?',
				[params[1], params[0], results[0].unitId],
				(error, results) => cb(error, 'Visiting Teachers Recieved')
			)
		})		
	},

	// Moves an Investigator to a Recent Convert, adds a baptism
	bap: function (params, from, cb) {
		inv.find(params[0], from, (error, results) => {
			if (error) { console.error('Error Finding Inv: ', error) }
			inv.baptize(results[0], from, (error, results) => {
				if (error) { console.error('Error Saving Baptism: ', error) }
				cb(error, 'Congrats on the Baptism!')
			})
		})
	},

	// Adds a Baptismal Date into an Investigator
	bd: function (params, from, cb) {
		inv.find(params[0], from, (error, results) => {
			if (error) { console.error('Error Finding Inv: ', error) }
			db.query(
				'UPDATE inv SET bd = ? WHERE id = ?',
				[params[1], results[0].id],
				cb(error, 'Baptism Date Recieved'));
		})
	},

	// Should add temple data to a Recent Convert
	temple: function (params, from, cb) {
	},

	// Adds a church attendance row for all of the Recent Converts or Investigators in the text
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

	// Moves an Investigator to a Former
	drop: function (params, from, cb) {
		dbUtils.findInv(params[0], from, (error, results) => {
			if (error) { console.error('Error Finding Inv: ', error) }
			inv.drop(results[0], params[1], (error, results) => {
				if (error) { console.error('Error Dropping Inv: ', error) }
				(error, results) => cb(error, 'Investigator Dropped')
			})
		})
	},

	// Moves a Former to an Investigator
	pickup: function (params, from, cb) {
		former.find(params[0], from, (error, results) => {
				if (error) { console.error('Error Finding Former: ', error) }
			inv.pickup(results[0], params[1], (error, results) => {
				if (error) { console.error('Error Picking Up Inv: ', error) }
				cb(error, 'Investigator Picked Up!')
			})
		})
	},

	// Creates commitment or responds with commitments based on parameters send
	commit: function (params, from, cb) {
		if (params[0]) {
			commit.new(params[0], from, params[1], params[2], (error, results) => {
				if (error) { console.error('Error Saving Commitment: ', error) }
				cb(error, 'Commitment Recieved')
			})
		} else {
			commit.get(from, (error, results) => {
				if (error) { console.error('Error Getting Commitments: ', error) }
				var message = ''
				for (var i = 0; i < results.length; i++) {
					message = message + results[i].name + ', ' + results[i].commitment + ', ' + results[i].followUp + '; ' 
				}

				cb(null, message)
			})
		}
	},

	// Deletes a commitment
	followup: function (params, from, cb) {
		commit.followUp(params[0], params[1], from, (error, results) => {
			if (error) { console.error('Error Following Up: ', error) }
			cb(error, 'Way to Follow Up!')
		})
	}

}