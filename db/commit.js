var db = require('./index')
var Nums = require('./nums')
var area = require('./area')
var rc = require('./rc')
var inv = require('./inv')
var unit = require('./unit')
var send = require('../twilio/send')

module.exports = {
	new: function (name, areaId, commitment, followUp, cb) {
		db.query('INSERT INTO commitments (name, areaId, commitment, followUp) VALUES (?,?,?,?)',
			[name, areaId, commitment, followUp], cb)
	},
	get: function (areaId, cb) {
		db.query('SELECT * FROM commitments WHERE areaId = ?', areaId, cb)
	},
	delete: function (name, commitment, from, cb) {
		db.query('DELETE FROM commitments WHERE areaId = ? AND name = ? AND commitment = ?',
			[from, name, commitment], cb)
	}
}