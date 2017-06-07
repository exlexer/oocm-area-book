var db = require('./index')

module.exports = {
	new: function (name, email, cb) {
		db.query('INSERT INTO missionaries (name, email) VALUES (?,?)',
			[name, email],
			cb
		)
	},
	update: function (name, email, leadership, areaId, id, cb) {
		db.query('UPDATE missionaries SET name = ?, email = ?, leadership = ?, areaId = ? WHERE id = ?',
			[name, email, leadership, areaId, id],
			cb
		)
	},
	get: function (cb) {
		db.query('SELECT name, email, id, areaId, leadership, gender FROM missionaries', cb)
	}
}