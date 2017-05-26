var db = require('./index')
var Nums = require('../data_manage/nums')
var send = require('../twilio/send')
var SHA256 = require("crypto-js/sha256")

module.exports = {
	sendNumbers: function () {
		var self = this
		db.query('SELECT id, districtId, name FROM areas', (error, results) => {
			var tasksToGo = max = results.length
			var messages = {}

			if(!tasksToGo) { console.log('done') } else {
				for (var i = 0; i < max; i++) {
					self.getAreaNums(results[i].id, results[i].districtId, results[i].name, (nums) => {

						messages[nums.districtId] = messages[nums.districtId] || ''
						messages[nums.districtId] = messages[nums.districtId] + 'Numbers for ' + nums.name + ' ni:' + nums.counts.ni + ', b/c:' + nums.counts.bap + ', bd:' + nums.counts.bd + '; '
						
						self.insertNums(nums.areaId, nums.counts, () => {
							if(--tasksToGo === 0) {
								db.query('SELECT a.districtId, a.phone FROM areas a '+
									'INNER JOIN missionaries m ON a.id = m.areaId '+
									'WHERE m.leadership = "dist"', (error, results) => {
										for (var i = 0; i < results.length; i++) {
											send(results[i].phone, messages[results[i].districtId])
										}
									})
							} })
					})
				}
			}
		})
	},

	getAreaNums: function (areaId, districtId, name, cb) {
		var num = new Nums(getDateForLastOccurence(4), areaId, districtId, name)
		num.getInv( () => num.getBap( () => num.getChurch( () => cb( num ))))
	},
	findInvOrRc: function (name, areaId, invCb, rcCb) {
		var self = this
		self.findInv(name, areaId, (error, results) => {	
			if(results.length) {
				invCb(error, results)
			} else {
				self.findUnits(areaId, (error, results) => {
					self.findRc(name, results[0].unitId, rcCb)
				})
			}
		})
	},


	getDominionNums: function () { },
	insertNums: function (areaId, nums, cb) {
	  db.query('INSERT INTO nums (areaId, bd, ni, bap) VALUES (?,?,?,?)',
	  	[areaId, nums.bd, nums.ni, nums.bap], cb)
	  },

	// Functions for Storing Church Attendance
	invAtChurch: function (invId, cb) {
		db.query('INSERT INTO church_attend (invId) VALUES (?)',
			[invId], cb)},
	rcAtChurch: function (rcId, cb) {
		db.query('INSERT INTO church_attend (rcId) VALUES (?)',
			[rcId], cb)},

	// Functions for Creating and Managing Missionaries
	checkPass: function (pw, id, passCb, failCb) {
		db.query('SELECT password FROM missionaries WHERE id = ?',
			[id], (error, results) => {
				var userPW = SHA256(pw).toString()
				if ( results[0].password === userPW ) {
					passCb()
				} else {
					failCb()
				}
			})},
	updateUser: function (name, email, newPass, id, cb) {
		var pass = !!newPass ? 'password = ? ': ''
		var query = 'UPDATE missionaries SET name = ?, email = ?, ' + pass + 'WHERE id = ?'
		var params = !!newPass ? [name, email, SHA256(newPass).toString(), id] : [name, email, id];
		db.query(query, params, cb)
	},
	newMissionary: function (name, email, cb) {
		db.query('INSERT INTO missionaries (name, email) VALUES (?,?)',
			[name, email], cb)},
	updateMissionary: function (name, email, leadership, areaId, id, cb) {
		db.query('UPDATE missionaries SET name = ?, email = ?, leadership = ?, areaId = ? WHERE id = ?',
			[name, email, leadership, areaId, id], cb)},
	getUser: function (id, cb) {
		db.query('SELECT name, email, leadership FROM missionaries WHERE id = ?',
			[id], cb)},
	getMissionaries: function (cb) {
		db.query('SELECT name, email, id, areaId, leadership, gender FROM missionaries', cb)},

	// Functions for Creating and Managing Areas
	newArea: function (name, phone, phoneTwo, districtId, unitArr, cb) {
		db.query('INSERT INTO areas (name, phone, phoneTwo, districtId) VALUES (?,?,?,?)',
			[name, phone, phoneTwo, districtId], (error, results) => {
				for (var i = 0, j = 0; i < unitArr.length; i++) {
					db.query('INSERT INTO area_unit (areaId, unitId) VALUES (?,?)',
						[results.insertId, unitArr[i]], (err, res) => {
							j++;
							if (j === unitArr.length) {
								cb(error, results)
							}
						})
				}
			})},

	updateArea: function (name, phone, phoneTwo, districtId, unitArr, id, cb) {
		db.query('UPDATE areas SET name = ?, phone = ?, phoneTwo = ?, districtId = ? WHERE id = ?',
			[name, phone, phoneTwo, districtId, id], (error, results) => {
				// for (var i = 0, j = 0; i < unitArr.length; i++) {
				// 	db.query('INSERT INTO area_unit (areaId, unitId) VALUES (?,?)',
				// 		[results.insertId, unitArr[i]],
				// 		function (err, res) {
				// 			j++;
				// 			if (j === unitArr.length) {
				// 				cb(error, results)
				// 			}
				// 		})
				// }
				cb(error, results)
			})},
	findArea: function (from, cb) {
		db.query('SELECT id, name FROM areas WHERE phone = ? OR phoneTwo = ?',
			[from, from], cb)},
	getAreas: function (cb) {
		db.query('SELECT * FROM areas', cb)},

	// Functions for Creating and Managing Recent Converts
	newRc: function (name, bd, unitId, age, gender, cb) {
		db.query('INSERT INTO rc (name, bd, unitId, age, gender) VALUES (?,?,?,?,?)',
			[name, bd, unitId, age, gender], cb)},
	getAreaRcs: function (missId, cb) {
		db.query(
			'SELECT rc.name name, rc.nickName nickName, u.name unit, rc.age age, rc.id id, rc.gender gender, rc.bd bd, rc.hters hters, rc.vters vters FROM rc '+
			'LEFT JOIN units u ON rc.unitId = u.id '+
			'LEFT JOIN area_unit au ON u.id = au.unitId '+
			'LEFT JOIN areas a ON au.areaId = a.id '+
			'LEFT JOIN missionaries m ON a.id = m.areaId '+
			'WHERE m.id = ?', [missId], cb
		)},
	getStakeRcs: function (stakeId, cb) { 
		db.query(
			'SELECT rc.name name, u.name unit, rc.age age, rc.gender gender, rc.bd bd, rc.hters hters, s.id stakeId, s.name stakeName, s.sheetId sheetId, rc.vters vters FROM rc '+
			'LEFT JOIN units u ON rc.unitId = u.id '+
			'LEFT JOIN stakes s ON u.stakeId = s.id '+
			'WHERE u.stakeId = ?', [stakeId], cb
		)},
	getStakeSheet: function (stakeId, cb) {
		db.query('SELECT sheetId FROM stakes WHERE id = ?', [stakeId], cb)
	},
	updateRc: function (rc, cb) {
		db.query('UPDATE rc SET nickName = ?, name = ?, bd = ?, gender = ? WHERE id = ?',
			[rc.nickName, rc.name, rc.bd, rc.gender, rc.id], cb)},
	findRc: function (name, unitId, cb) {
		db.query('SELECT * FROM rc WHERE name = ? OR nickName = ? AND unitId = ?',
			[name, name, unitId], cb)},	

	// Functions for Creating and Managing Districts
	newDistrict: function (name, zoneId, cb) {
		db.query('INSERT INTO districts (name, zoneId) VALUES (?,?)',
			[name, zoneId], cb)},
	updateDistrict: function (zoneId, districtId) {
		db.query("UPDATE districts SET zoneId = ? WHERE id = ?",
			[zoneId, districtId], cb)},
	getDistrictAreas: function (missionaryId) {
		db.query('SELECT districtId FROM areas WHERE id = ?', [missionaryId], (error, results) => {
			db.query('SELECT areaId FROM districts WHERE id = ?', [results[0].districtId], cb)
		})},
	getDistricts: function (cb) {
		db.query('SELECT * FROM districts', cb)},

	// Functions for Creating and Managing Zones
	newZone: function (name, stakeId, cb) {
		db.query('INSERT INTO zones (name, stakeId) VALUES (?, ?)',
			[name, stakeId], cb)},
	getZoneAreas: function () {},
	getZones: function (cb) {
		db.query('SELECT * FROM zones', cb)},

	// Functions for Creating and Managing Lessons
	getLessons: function (missionaryId, cb) {
	  db.query(
	    'SELECT l.summary, l.lesson, l.OrderDate, rc.id, rc.unitId, rc.name FROM lessons l '+
	    'INNER JOIN rc ON l.rcId = rc.id '+
	    'LEFT JOIN area_unit au ON rc.unitId = au.unitId '+
	    'LEFT JOIN missionaries m ON au.areaId = m.areaId '+
	    'WHERE m.id = ? '+
	    'UNION '+
	    'SELECT l.summary, l.lesson, l.OrderDate, inv.id, inv.areaId, inv.name FROM lessons l '+
	    'INNER JOIN inv ON l.invId = inv.id '+
	    'LEFT JOIN missionaries m ON inv.areaId = m.areaId '+
	    'WHERE m.id = ? '+
	    'UNION '+
	    'SELECT l.summary, l.lesson, l.OrderDate, f.id, f.areaId, f.name FROM lessons l '+
	    'INNER JOIN former f ON l.formerId = f.id '+
	    'LEFT JOIN missionaries m ON f.areaId = m.areaId '+
	    'WHERE m.id = ?',
    	[missionaryId, missionaryId, missionaryId], cb)},
	updateLesson: function (invId, rcId, formerId, type, typeId, cb) {
		db.query('UPDATE lessons SET invId = ?, rcId = ?, formerId = ?  WHERE ? = ?',
			[invId, rcId, formerId, type, typeId], cb)},

	// Functions for Creating and Managing Former Investigators
	getFormer: function (missionaryId, cb) {
		db.query(
			'SELECT f.name, f.id, f.dropReason reason, f.address, f.areaId, f.OrderDate, f.gender, f.phoneNumber FROM former f '+
			'LEFT JOIN missionaries m ON f.areaId = m.areaId '+
			'WHERE m.id = ?',
			[missionaryId], cb)},
	findFormer: function (name, areaId, cb) {
		db.query('SELECT * FROM former WHERE name = ? OR nickName = ? AND areaId = ?',
			[name, name, areaId], cb)},
	deleteFormer: function (formerId, cb) {
		db.query('DELETE FROM former WHERE id = ?',
			[formerId], cb)},

	// Functions for Creating and Managing Investigators
	getInv: function (missionaryId, cb) {
		db.query(
			'SELECT inv.name, inv.bd, inv.id, inv.address, inv.areaId, inv.nickName, inv.OrderDate, inv.gender, inv.phoneNumber, inv.summary FROM inv '+
			'LEFT JOIN missionaries m ON inv.areaId = m.areaId '+
			'WHERE m.id = ?',
			[missionaryId], cb)},
	getAreaInv: function (areaId, cb) {
		db.query(
			'SELECT name FROM inv WHERE areaId = ?', areaId, cb)
	},
	deleteInv: function (invId, cb) {
		db.query('DELETE FROM inv WHERE id = ?',
			[invId], cb)},
	findInv: function (name, areaId, cb) {
		db.query('SELECT * FROM inv WHERE name = ? OR nickName = ? AND areaId = ?',
			[name, name, areaId], cb)},
	newInv: function (name, summary, phoneNumber, address, areaId, cb) {
		db.query('INSERT INTO inv (name, summary, phoneNumber, address, areaId) VALUES (?,?,?,?,? )',
			[name, summary, phoneNumber, address, areaId], (error, results) => cb(error, 'New Investigator Recieved'))},
	dropInv: function (inv, reason, cb) {
		var self = this
		db.query('INSERT INTO former (name, nickName, dropReason, address, phoneNumber, areaId, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[inv.name, inv.nickName, reason, inv.address, inv.phoneNumber, inv.areaId, inv.gender], (error, results) => {
				var formerId = results.insertId;
				db.query('UPDATE lessons SET formerId = ?  WHERE invId = ?', [formerId, inv.id], (error, results) => {
					db.query('UPDATE lessons SET invId = null WHERE formerId = ?', [formerId], (error, results) => {
						self.deleteInv(inv.id, cb)
					})
				})
			}) },
	pickupInv: function (former, cb) {
		var self = this
		db.query('INSERT INTO inv (name, nickName, address, phoneNumber, areaId, gender) VALUES (?, ?, ?, ?, ?, ?)',
			[former.name, former.nickName, former.address, former.phoneNumber, former.areaId, former.gender],
			(error, results) => {
				var invId = results.insertId;
				db.query('UPDATE lessons SET invId = ?  WHERE formerId = ?', [invId, former.id], (error, results) => {
					db.query('UPDATE lessons SET formerId = null WHERE invId = ?', [invId], (error, results) => {
						self.deleteFormer(former.id, cb)
					})
				})
			})},
	updateInv: function (inv, cb) {
		db.query('UPDATE inv SET nickName = ?, name = ?, bd = ?, gender = ?, phoneNumber = ?, address = ?, areaId = ?, summary = ? WHERE id = ?',
			[inv.nickName, inv.name, inv.bd, inv.gender, inv.phoneNumber, inv.address, inv.areaId, inv.summary, inv.id], cb)},
	bapInv: function (inv, from, cb) {
		var self = this
		self.findUnits(from, (error, results) => {
			// Inserts into correct unit
			self.newRc(inv.name, inv.bd, results[0].unitId, inv.age, inv.gender,
				(error, results) => {
					console.log(error, results)
					self.updateLesson(null, results.insertId, null, 'invId', inv.id, cb)
					self.deleteInv(inv.id, cb)
					db.query(
						'INSERT INTO bap (areaId, rcId) VALUES (?,?)',
						[from, results.insertId],
						cb)
				}
			)
		})},

	// Functions for Managing Church Stakes
	updateSheetId: function (stakeId, sheetId, cb) {
		cb = cb || function() {}
		db.query('UPDATE stakes SET sheetId = ? WHERE id = ?', [sheetId, stakeId], cb)},
	
	// Functions for Creating and Managing Church Units
	deleteUnit: function (id, cb) {
		db.query('DELETE FROM units WHERE id = ?',
			[id], cb)},
	updateUnit: function (name, stakeId, unitId, cb) {
		db.query('UPDATE units SET name = ?, stakeId = ? WHERE id = ?',
			[name, stakeId, unitId], cb)},
	findUnits: function (areaId, cb) {
		db.query('SELECT * FROM area_unit WHERE areaId = ?',
			[areaId], cb)},

	addCommitment: function (name, areaId, commitment, followUp, cb) {
		db.query('INSERT INTO commitments (name, areaId, commitment, followUp) VALUES (?,?,?,?)',
			[name, areaId, commitment, followUp], cb)
	},

	getCommitments: function (areaId, cb) {
		db.query('SELECT * FROM commitments WHERE areaId = ?', areaId, cb)
	},
	followUp: function (name, commitment, from, cb) {
		db.query('DELETE FROM commitments WHERE areaId = ? AND name = ? AND commitment = ?',
			[from, name, commitment], cb)
	}

}

function getDateForLastOccurence( dayInd ) {

  var date = new Date()
	var day = date.getDay() + (7 - dayInd)
  var difference = day % 7 === 0 ? 7 : day
  date.setDate( date.getDate() - difference )
  date.setUTCHours(23)
  date.setUTCMinutes(59)
  return date
}
