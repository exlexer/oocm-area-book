var db = require('./index')

module.exports = {
	church: function (rcId, cb) {
		db.query('INSERT INTO church_attend (rcId) VALUES (?)',
			[rcId], cb)},
	new: function (name, bd, unitId, age, gender, cb) {
		db.query('INSERT INTO rc (name, bd, unitId, age, gender) VALUES (?,?,?,?,?)',
			[name, bd, unitId, age, gender], cb)},
	getArea: function (missId, cb) {
		db.query(
			'SELECT rc.name name, rc.nickName nickName, u.name unit, rc.age age, rc.id id, rc.gender gender, rc.bd bd, rc.hters hters, rc.vters vters FROM rc '+
			'LEFT JOIN units u ON rc.unitId = u.id '+
			'LEFT JOIN area_unit au ON u.id = au.unitId '+
			'LEFT JOIN areas a ON au.areaId = a.id '+
			'LEFT JOIN missionaries m ON a.id = m.areaId '+
			'WHERE m.id = ?', [missId], cb
		)},
	getStake: function (stakeId, cb) { 
		db.query(
			'SELECT rc.name name, u.name unit, rc.age age, rc.gender gender, rc.bd bd, rc.hters hters, s.id stakeId, s.name stakeName, s.sheetId sheetId, rc.vters vters FROM rc '+
			'LEFT JOIN units u ON rc.unitId = u.id '+
			'LEFT JOIN stakes s ON u.stakeId = s.id '+
			'WHERE u.stakeId = ?', [stakeId], cb
		)},
	update: function (rc, cb) {
		db.query('UPDATE rc SET nickName = ?, name = ?, bd = ?, gender = ? WHERE id = ?',
			[rc.nickName, rc.name, rc.bd, rc.gender, rc.id], cb)},
	find: function (name, unitId, cb) {
		db.query('SELECT * FROM rc WHERE name = ? OR nickName = ? AND unitId = ?',
			[name, name, unitId], cb)},	
}