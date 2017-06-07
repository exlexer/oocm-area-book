var db = require('./index')

module.exports = {
	delete: function (id, cb) {
		db.query('DELETE FROM units WHERE id = ?',
			[id], cb)},
	update: function (name, stakeId, unitId, cb) {
		db.query('UPDATE units SET name = ?, stakeId = ? WHERE id = ?',
			[name, stakeId, unitId], cb)},
	find: function (areaId, cb) {
		db.query('SELECT * FROM area_unit WHERE areaId = ?',
			[areaId], cb)},
}