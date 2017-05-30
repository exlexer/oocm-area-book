var db = require('./index')

module.exports = {
	get: function (missionaryId, cb) {
		db.query(
			'SELECT f.name, f.id, f.dropReason reason, f.address, f.areaId, f.OrderDate, f.gender, f.phoneNumber FROM former f '+
			'LEFT JOIN missionaries m ON f.areaId = m.areaId '+
			'WHERE m.id = ?',
			[missionaryId], cb)},
	find: function (name, areaId, cb) {
		db.query('SELECT * FROM former WHERE name = ? OR nickName = ? AND areaId = ?',
			[name, name, areaId], cb)},
	delete: function (formerId, cb) {
		db.query('DELETE FROM former WHERE id = ?',
			[formerId], cb)},
	pickup: function (former, cb) {
		var self = this
		db.query('INSERT INTO inv (name, nickName, address, phoneNumber, areaId, gender) VALUES (?,?,?,?,?,?)',
			[former.name, former.nickName, former.address, former.phoneNumber, former.areaId, former.gender],
			(error, results) => {
				var invId = results.insertId;
				db.query('UPDATE lessons SET invId = ?  WHERE formerId = ?', [invId, former.id], (error, results) => {
					db.query('UPDATE lessons SET formerId = null WHERE invId = ?', [invId], (error, results) => {
						self.delete(former.id, cb)
					})
				})
			})}
}