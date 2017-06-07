var db = require('./index')
var Nums = require('./nums')

module.exports = {

	getNums: function (areaId, districtId, name, cb) {
		var num = new Nums(getDateForLastOccurence(4), areaId, districtId, name)
		num.getInv( () => num.getBap( () => num.getChurch( () => cb( num ))))
	},

	new: function (name, phone, phoneTwo, districtId, unitArr, cb) {
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

	update: function (name, phone, phoneTwo, districtId, unitArr, id, cb) {
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
	find: function (from, cb) {
		db.query('SELECT id, name FROM areas WHERE phone = ? OR phoneTwo = ?',
			[from, from], cb)
	},
	findUnits: function (areaId, cb) {
		db.query('SELECT * FROM area_unit WHERE areaId = ?',
			[areaId], cb)
	},
	get: function (cb) {
		db.query('SELECT * FROM areas', cb)},

	getRcs: function (missId, cb) {
		db.query(
			'SELECT rc.name name, rc.nickName nickName, u.name unit, rc.age age, rc.id id, rc.gender gender, rc.bd bd, rc.hters hters, rc.vters vters FROM rc '+
			'LEFT JOIN units u ON rc.unitId = u.id '+
			'LEFT JOIN area_unit au ON u.id = au.unitId '+
			'LEFT JOIN areas a ON au.areaId = a.id '+
			'LEFT JOIN missionaries m ON a.id = m.areaId '+
			'WHERE m.id = ?', [missId], cb
		)},
	getInv: function (areaId, cb) {
		db.query(
			'SELECT name FROM inv WHERE areaId = ?', areaId, cb)
	},
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
