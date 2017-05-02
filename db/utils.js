var db = require('./index.js');

module.exports = {

	getUser: function (id, cb) {
		db.query('SELECT name, email, leadership FROM missionaries WHERE id = ?', [id], cb);
	},

	getStakeRcs: function (stakeId, cb) { 
		db.query(
			'SELECT rc.name name, u.name unit, rc.age age, rc.gender gender, rc.bd bd, rc.hters hters, s.id stakeId, s.name stakeName, s.sheetId sheetId, rc.vters vters FROM rc '+
			'LEFT JOIN units u ON rc.unitId = u.id '+
			'LEFT JOIN stakes s ON u.stakeId = s.id '+
			'WHERE u.stakeId = ?', [stakeId], cb
		)
	},

	findRc: function (name, unitId, cb) {
		db.query('SELECT * FROM rc WHERE name=? AND unitId=?', [name, unitId], cb);
	},	

	findUnits: function (areaId, cb) {
		db.query('SELECT * FROM area_unit WHERE areaId = ?', areaId, cb);
	},


	weekNewInv: function (start, end, cb) {
		bd.query('SELECT areaId FROM inv WHERE OrderDate BETWEEN ? AND ?', [start, end], cb);
	},

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
	    [start, end, start, end], cb);
	},

	weekBaptisms: function (start, end, cb) {
		bd.query('SELECT areaId FROM bap WHERE OrderDate BETWEEN ? AND ?', [start, end], cb);
	},

	weekInvAtChurch: function (start, end, cb) {
		db.query('SELECT areaId FROM church_attend WHERE OrderDate BETWEEN ? AND ?', [start, end], cb);
	},

	invAtChurch: function (invId) {
		db.query('INSERT INTO church_attend (invId) VALUES (?)', [invId], cb);
	},

	rcAtChurch: function (rcId) {
		db.query('INSERT INTO church_attend (rcId) VALUES (?)', [rcId], cb);
	},

	getMissionaries: function (cb) {
		db.query('SELECT name, email, id, areaId, leadership FROM missionaries', cb);
	},

	newMissionary: function (name, email, cb) {
		db.query('INSERT INTO missionaries (name, email) VALUES (?,?)', [name, email], cb);
	},

	updateMissionary: function (name, email, leadership, areaId, id, cb) {
		db.query('UPDATE missionaries SET name = ?, email = ?, leadership = ?, areaId = ? WHERE id = ?', [name, email, leadership, areaId, id], cb)
	},

	getAreas: function (cb) {
		db.query('SELECT * FROM areas', cb);
	},

	findArea: function (from, cb) {
		db.query('SELECT id, name FROM areas WHERE phone = ? OR phoneTwo = ?', [from, from], cb);
	},

	getAreaRcs: function (missId, cb) {
		db.query(
			'SELECT rc.name name, u.name unit, rc.age age, rc.gender gender, rc.bd bd, rc.hters hters, rc.vters vters FROM rc '+
			'LEFT JOIN units u ON rc.unitId = u.id '+
			'LEFT JOIN area_unit au ON u.id = au.unitId '+
			'LEFT JOIN areas a ON au.areaId = a.id '+
			'LEFT JOIN missionaries m ON a.id = m.areaId '+
			'WHERE m.id = ?', [missId], cb
		)
	},

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
			})
	},
	
	getDistricts: function (cb) {
		db.query('SELECT * FROM districts', cb);
	},

	newDistrict: function (name, zoneId, cb) {
		db.query('INSERT INTO districts (name, zoneId) VALUES (?,?)', [name, zoneId], cb);
	},

	updateDistrict: function (zoneId, districtId) {
		db.query("UPDATE districts SET zoneId = ? WHERE id = ?", [zoneId, districtId], cb)
	},

	getZones: function (cb) {
		db.query('SELECT * FROM zones', cb);
	},

	newZone: function (name, stakeId, cb) {
		db.query('INSERT INTO zones (name, stakeId) VALUES (?, ?)', [name, stakeId], cb);
	},

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
    	[missionaryId, missionaryId], cb)
	},

	getInv: function (missionaryId, cb) {
		db.query(
			'SELECT * FROM inv '+
			'LEFT JOIN missionaries m ON inv.areaId = m.areaId '+
			'WHERE m.id = ?',
			[missionaryId], cb)
	},

	findInv: function (name, areaId, cb) {
		db.query('SELECT * FROM inv WHERE name=? AND areaId=?', [name, areaId], cb)
	},

	newInv: function (name, phoneNumber, areaId, cb) {
		db.query('INSERT INTO inv (name, phoneNumber, areaId) VALUES (?,?,?)', [name, phoneNumber, areaId], db);
	},

	getAreaNums: function (missionaryId, cb) {
		db.query(
			'SELECT n.bd, n.ni, n.bap, n.OrderDate FROM nums n '+
			'INNER JOIN missionaries m ON n.areaId = m.areaId '+
			'WHERE m.id = ?',
			[missionaryId], cb);
	},

	getDominionNums: function () {

	},

	insertNums: function (nums) {
		for(var area in nums) {
	    db.query('INSERT INTO nums (areaId, bd, ni, bap) VALUES (?,?,?,?)',
	     	[area, nums[area].bd, nums[area].ni, nums[area].bap],
	     	function (error, results) {});
			};
	},

	updateSheetId: function (stakeId, sheetId, cb) {
		cb = cb || function() {};
		db.query('UPDATE stakes SET sheetId = ? WHERE id = ?', [sheetId, stakeId], cb)
	},
	
	deleteUnit: function (id, cb) {
		db.query('DELETE FROM units WHERE id = ?', [id], cb)
	},

	updateUnit: function (name, stakeId, unitId, cb) {
		db.query('UPDATE units SET name = ?, stakeId = ? WHERE id = ?', [name, stakeId, unitId], cb);
	}
};