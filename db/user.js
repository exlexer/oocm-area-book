var db = require('./index')
var Nums = require('../data_manage/nums')
var SHA256 = require("crypto-js/sha256")

module.exports = {
	update: function (name, email, newPass, id, cb) {
		var pass = !!newPass ? ', password = ? ': ' '
		var query = 'UPDATE missionaries SET name = ?, email = ?' + pass + 'WHERE id = ?'
		var params = !!newPass ? [name, email, SHA256(newPass).toString(), id] : [name, email, id];
		db.query(query, params, cb)
	},
	get: function (id, cb) {
		db.query('SELECT name, email, leadership FROM missionaries WHERE id = ?',
			[id], cb)
	}
}