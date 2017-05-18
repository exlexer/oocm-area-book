var db = require('../db/index')

var Nums = function (start, areaId, districtId, name) {
	this.start = start
	this.areaId = areaId
	this.name = name
	this.districtId = districtId
	this.end = new Date()
	this.end.setUTCMinutes(59)
	this.end.setUTCHours(23)
	this.counts = new Object()
}

Nums.prototype.getInv = function (cb) {
	this.counts.bd = 0
	db.query('SELECT id, bd FROM inv WHERE OrderDate BETWEEN ? AND ? AND areaID = ?',
		[this.start, this.end, this.areaId], (error, results) => {
			this.counts.ni = results.length
			for (var i = 0; i < results.length; i++) {
				if ( results[i].bd ) { this.counts.bd++ }
			}
			cb()
	})
}

Nums.prototype.getBap = function (cb) {
	db.query('SELECT * FROM bap WHERE OrderDate BETWEEN ? AND ? AND areaID = ?',
		[this.start, this.end, this.areaId], (error, results) => {
			this.counts.bap = results.length
			cb()
		})
}

Nums.prototype.getChurch  = function (cb) {
	db.query('SELECT * FROM church_attend WHERE OrderDate BETWEEN ? AND ? AND areaID = ?',
		[this.start, this.end, this.areaId], (error, results) => {
			if (error) { console.error('error getting church', error)}
			this.counts.church = results.length
			cb()
		})
}

module.exports = Nums