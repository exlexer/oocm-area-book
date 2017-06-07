var db = require('./index')
var SHA256 = require("crypto-js/sha256")

module.exports = {
	update: function (name, email, newPass, id, cb) {
		var pass = !!newPass ? ', password = ? ': ' '
		var query = 'UPDATE missionaries SET name = ?, email = ?' + pass + 'WHERE id = ?'
		var params = !!newPass ? [name, email, SHA256(newPass).toString(), id] : [name, email, id];
		db.query(query, params, cb)
	},
	get: function (id, cb) {
		db.query('SELECT name, email, leadership, areaId FROM missionaries WHERE id = ?',
			[id], cb)
	},
	check: function (pw, id, passCb, failCb) {
		db.query('SELECT password FROM missionaries WHERE id = ?',
			[id], (error, results) => {
				var userPW = SHA256(pw).toString()
				if ( results[0].password === userPW ) {
					passCb()
				} else {
					failCb()
				}
			}
		)
	}
}