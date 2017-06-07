var db = require('./index')

module.exports = {
	new: function (name, stakeId, cb) {
		db.query('INSERT INTO zones (name, stakeId) VALUES (?, ?)',
			[name, stakeId], cb)},
	get: function (cb) {
		db.query('SELECT * FROM zones', cb)},
}
