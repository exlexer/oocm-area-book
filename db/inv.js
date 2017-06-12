var db = require('./index')
var utils = require('./utils')
var rc = require('./rc')
var lesson = require('./lesson')
var former = require('./former')
var unit = require('./unit')

module.exports = {
	church: function (invId, cb) {
		db.query(
			'INSERT INTO church_attend (invId) VALUES (?)',
			[invId], cb
		)
	},
	get: function (missionaryId, cb) {
		db.query(
			'SELECT inv.name, inv.bd, inv.id, inv.address, '+
			'inv.areaId, inv.nickName, inv.OrderDate, inv.gender, '+
			'inv.phoneNumber, inv.summary FROM inv '+
			'LEFT JOIN missionaries m ON inv.areaId = m.areaId '+
			'WHERE m.id = ?',
			[missionaryId], cb
		)
	},
	getArea: function (areaId, cb) {
		db.query(
			'SELECT name FROM inv WHERE areaId = ?', areaId, cb
		)
	},
	delete: function (invId, cb) {
		db.query('DELETE FROM inv WHERE id = ?',
			[invId], cb)},
	find: function (name, areaId, cb) {
		db.query('SELECT * FROM inv WHERE name = ? OR nickName = ? AND areaId = ?',
			[name, name, areaId], cb)},
	new: function (name, summary, phoneNumber, address, areaId, cb) {
		db.query('INSERT INTO inv (name, summary, phoneNumber, address, areaId) VALUES (?,?,?,?,?)',
			[name, summary, phoneNumber, address, areaId], (error, results) => cb(error, 'New Investigator Recieved'))},
	drop: function (inv, reason, cb) {
		var self = this
		db.query('INSERT INTO former (name, nickName, dropReason, address, phoneNumber, areaId, gender) VALUES (?,?,?,?,?,?,?)',
			[inv.name, inv.nickName, reason, inv.address, inv.phoneNumber, inv.areaId, inv.gender], (error, results) => {
				var formerId = results.insertId;
				db.query('UPDATE lessons SET formerId = ?  WHERE invId = ?', [formerId, inv.id], (error, results) => {
					db.query('UPDATE lessons SET invId = null WHERE formerId = ?', [formerId], (error, results) => {
						self.delete(inv.id, cb)
					})
				})
			})},

	pickup: function (former, cb) {
		db.query('INSERT INTO inv (name, nickName, address, phoneNumber, areaId, gender) VALUES (?, ?, ?, ?, ?, ?)',
			[former.name, former.nickName, former.address, former.phoneNumber, former.areaId, former.gender],
			function (error, results) {
				var invId = results.insertId;
				db.query('UPDATE lessons SET invId = ?  WHERE formerId = ?', [invId, former.id], function (error, results) {
					db.query('UPDATE lessons SET formerId = null WHERE invId = ?', [invId], function (error, results) {
						former.delete(former.id, cb);
					})
				})
			})},


	update: function (inv, cb) {
		var bd = new Date(inv.bd);
		db.query('UPDATE inv SET nickName = ?, name = ?, bd = ?, gender = ?, phoneNumber = ?, address = ?, areaId = ?, summary = ? WHERE id = ?',
			[inv.nickName, inv.name, bd, inv.gender, inv.phoneNumber, inv.address, inv.areaId, inv.summary, inv.id], cb)},
	baptize: function (inv, from, cb) {
		var self = this
		unit.find(from, (error, results) => {
			// Inserts into correct unit
			rc.new(inv.name, inv.bd, results[0].unitId, inv.age, inv.gender,
				(error, results) => {
					lesson.update(null, results.insertId, null, 'invId', inv.id, cb)
					self.delete(inv.id, cb)
					db.query(
						'INSERT INTO bap (areaId, rcId) VALUES (?,?)',
						[from, results.insertId],
						cb)
				}
			)
		})}
}