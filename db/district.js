var db = require('./index')

module.exports = {
	new: function (name, zoneId, cb) {
		db.query('INSERT INTO districts (name, zoneId) VALUES (?,?)',
			[name, zoneId], cb)
	},
	update: function (zoneId, districtId) {
		db.query('UPDATE districts SET zoneId = ? WHERE id = ?',
			[zoneId, districtId], cb
		)
	},
	get: function (cb) {
		db.query('SELECT * FROM districts', cb)
	}
}