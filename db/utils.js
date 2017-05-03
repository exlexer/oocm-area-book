var db = require('./index.js');

module.exports = {

	// Functions for Collecting and Storing Numbers
	weekNewInv: function (start, end, cb) {
		bd.query('SELECT areaId FROM inv WHERE OrderDate BETWEEN ? AND ?',
			[start, end], cb);},
	weekLessons: function (start, end, cb) {
		db.query(
	    'SELECT l.summary, a.areaId FROM lessons l '+
	    'INNER JOIN rc ON l.rcId = rc.id '+
	    'INNER JOIN area_unit a ON rc.unitId = a.unitId '+
	    'WHERE l.OrderDate BETWEEN ? and ? '+
	    'UNION '+
	    'SELECT l.summary, inv.areaId FROM lessons l '+
	    'INNER JOIN inv ON l.invId = inv.id '+
	    'WHERE l.OrderDate BETWEEN ? and ?',
	    [start, end, start, end], cb);},
	weekBaptisms: function (start, end, cb) {
		bd.query('SELECT areaId FROM bap WHERE OrderDate BETWEEN ? AND ?',
			[start, end], cb);},
	weekInvAtChurch: function (start, end, cb) {
		db.query('SELECT areaId FROM church_attend WHERE OrderDate BETWEEN ? AND ?', 
			[start, end], cb);},
	getAreaNums: function (missionaryId, cb) {
		db.query(
			'SELECT n.bd, n.ni, n.bap, n.OrderDate FROM nums n '+
			'INNER JOIN missionaries m ON n.areaId = m.areaId '+
			'WHERE m.id = ?',
			[missionaryId], cb);},
	getDominionNums: function () { },
	insertNums: function (nums) {
		for(var area in nums) {
	    db.query('INSERT INTO nums (areaId, bd, ni, bap) VALUES (?,?,?,?)',
	     	[area, nums[area].bd, nums[area].ni, nums[area].bap],
	     	function (error, results) {});
			}; },

	// Functions for Storing Church Attendance
	invAtChurch: function (invId, cb) {
		db.query('INSERT INTO church_attend (invId) VALUES (?)',
			[invId], cb);},
	rcAtChurch: function (rcId, cb) {
		db.query('INSERT INTO church_attend (rcId) VALUES (?)',
			[rcId], cb);},

	// Functions for Creating and Managing Missionaries
	newMissionary: function (name, email, cb) {
		db.query('INSERT INTO missionaries (name, email) VALUES (?,?)',
			[name, email], cb);},
	updateMissionary: function (name, email, leadership, areaId, id, cb) {
		db.query('UPDATE missionaries SET name = ?, email = ?, leadership = ?, areaId = ? WHERE id = ?',
			[name, email, leadership, areaId, id], cb)},
	getUser: function (id, cb) {
		db.query('SELECT name, email, leadership FROM missionaries WHERE id = ?',
			[id], cb);},
	getMissionaries: function (cb) {
		db.query('SELECT name, email, id, areaId, leadership FROM missionaries', cb);},

	// Functions for Creating and Managing Areas
	newArea: function (name, phone, phoneTwo, districtId, unitArr, cb) {
		db.query('INSERT INTO areas (name, phone, phoneTwo, districtId) VALUES (?,?,?,?)',
			[name, phone, phoneTwo, districtId], function (error, results) {
				for (var i = 0, j = 0; i < unitArr.length; i++) {
					db.query('INSERT INTO area_unit (areaId, unitId) VALUES (?,?)',
						[results.insertId, unitArr[i]],
						function (err, res) {
							j++;
							if (j === unitArr.length) {
								cb(error, results)
							}
						})
				};
			})},
	findArea: function (from, cb) {
		db.query('SELECT id, name FROM areas WHERE phone = ? OR phoneTwo = ?',
			[from, from], cb);},
	getAreas: function (cb) {
		db.query('SELECT * FROM areas', cb);},

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
	updateRc: function (rc, cb) {
		db.query('UPDATE rc SET nickName = ?, name = ?, bd = ?, gender = ? WHERE id = ?',
			[rc.nickName, rc.name, rc.bd, rc.gender, rc.id], cb)},
	findRc: function (name, unitId, cb) {
		db.query('SELECT * FROM rc WHERE name = ? OR nickName = ? AND unitId = ?',
			[name, name, unitId], cb);},	

	// Functions for Creating and Managing Districts
	newDistrict: function (name, zoneId, cb) {
		db.query('INSERT INTO districts (name, zoneId) VALUES (?,?)',
			[name, zoneId], cb);},
	updateDistrict: function (zoneId, districtId) {
		db.query("UPDATE districts SET zoneId = ? WHERE id = ?",
			[zoneId, districtId], cb)},
	getDistrictAreas: function (missionaryId) {
		db.query('SELECT districtId FROM areas WHERE id = ?', [missionaryId], function (error, results) {
			db.query('SELECT areaId FROM districts WHERE id = ?', [results[0].districtId], cb);
		})},
	getDistricts: function (cb) {
		db.query('SELECT * FROM districts', cb);},

	// Functions for Creating and Managing Zones
	newZone: function (name, stakeId, cb) {
		db.query('INSERT INTO zones (name, stakeId) VALUES (?, ?)',
			[name, stakeId], cb);},
	getZoneAreas: function () {},
	getZones: function (cb) {
		db.query('SELECT * FROM zones', cb);},

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
	    'WHERE m.id = ?',
    	[missionaryId, missionaryId], cb)},
	updateLesson: function (invId, rcId, formerId, type, typeId, cb) {
		db.query('UPDATE lessons SET invId = ?, rcId = ?, formerId = ?  WHERE ? = ?',
			[invId, rcId, formerId, type, typeId], cb);},

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
			[formerId], cb);},

	// Functions for Creating and Managing Investigators
	getInv: function (missionaryId, cb) {
		db.query(
			'SELECT inv.name, inv.bd, inv.id, inv.address, inv.areaId, inv.nickName, inv.OrderDate, inv.gender, inv.phoneNumber FROM inv '+
			'LEFT JOIN missionaries m ON inv.areaId = m.areaId '+
			'WHERE m.id = ?',
			[missionaryId], cb)},
	deleteInv: function (invId, cb) {
		db.query('DELETE FROM inv WHERE id = ?',
			[invId], cb);},
	findInv: function (name, areaId, cb) {
		db.query('SELECT * FROM inv WHERE name = ? OR nickName = ? AND areaId = ?',
			[name, name, areaId], cb)},
	newInv: function (name, phoneNumber, areaId, cb) {
		db.query('INSERT INTO inv (name, phoneNumber, areaId) VALUES (?,?,?)',
			[name, phoneNumber, areaId], cb);},
	dropInv: function (inv, reason, cb) {
		var utils = this;
		db.query('INSERT INTO former (name, nickName, dropReason, address, phoneNumber, areaId, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[inv.name, inv.nickName, reason, inv.address, inv.phoneNumber, inv.areaId, inv.gender],
			function (error, results) {
				utils.updateLesson(null, null, results.insertId, 'invId', inv.id, function (error, results) {
					utils.deleteInv(inv.id, cb);
				});
			})},
	pickupInv: function (former, cb) {
		var utils = this;
		db.query('INSERT INTO inv (name, nickName, address, phoneNumber, areaId, gender) VALUES (?, ?, ?, ?, ?, ?)',
			[former.name, former.nickName, former.address, former.phoneNumber, former.areaId, former.gender],
			function (error, results) {
				console.log(error, results)
				utils.updateLesson(results.insertId, null, null, 'formerId', former.id, function (error, results) {
					utils.deleteFormer(former.id, cb);
				});
			})},
	updateInv: function (inv, cb) {
		db.query('UPDATE inv SET nickName = ?, name = ?, bd = ?, gender = ?, areaId = ? WHERE id = ?',
			[inv.nickName, inv.name, inv.bd, inv.gender, inv.areaId, inv.id], cb)},
	bapInv: function (inv, from, cb) {
		var utils = this
		utils.findUnits(from, function (error, results) {
			// Inserts into correct unit
			utils.newRc(inv.name, inv.bd, results[0].unitId, inv.age, inv.gender,
				function (error, results) {
					console.log(error, results);
					utils.updateLesson(null, results.insertId, null, 'invId', inv.id, cb);
					utils.deleteInv(inv.id, cb);
					db.query(
						'INSERT INTO bap (areaId, rcId) VALUES (?,?)',
							[from, results.insertId],
						cb);
				}
			);
		});},

	// Functions for Managing Church Stakes
	updateSheetId: function (stakeId, sheetId, cb) {
		cb = cb || function() {};
		db.query('UPDATE stakes SET sheetId = ? WHERE id = ?', [sheetId, stakeId], cb)},
	
	// Functions for Creating and Managing Church Units
	deleteUnit: function (id, cb) {
		db.query('DELETE FROM units WHERE id = ?',
			[id], cb)},
	updateUnit: function (name, stakeId, unitId, cb) {
		db.query('UPDATE units SET name = ?, stakeId = ? WHERE id = ?',
			[name, stakeId, unitId], cb);},
	findUnits: function (areaId, cb) {
		db.query('SELECT * FROM area_unit WHERE areaId = ?',
			[areaId], cb);}

};