var db = require('./index')
var area = require('./area')
var rc = require('./rc')
var inv = require('./inv')
var unit = require('./unit')
var send = require('../twilio/send')

module.exports = {
	sendNumbers: function () {
		var self = this
		db.query('SELECT id, districtId, name FROM areas', (error, results) => {
			var tasksToGo = max = results.length
			var messages = {}

			if(!tasksToGo) { console.log('done') } else {
				for (var i = 0; i < max; i++) {
					area.getNums(results[i].id, results[i].districtId, results[i].name, (nums) => {

						messages[nums.districtId] = messages[nums.districtId] || ''
						messages[nums.districtId] = messages[nums.districtId] + 'Numbers for ' + nums.name + ' ni:' + nums.counts.ni + ', b/c:' + nums.counts.bap + ', bd:' + nums.counts.bd + '; '
						
						nums.insert(() => {
							if(--tasksToGo === 0) {
								db.query('SELECT a.districtId, a.phone FROM areas a '+
									'INNER JOIN missionaries m ON a.id = m.areaId '+
									'WHERE m.leadership = "dist"', (error, results) => {
										for (var i = 0; i < results.length; i++) {
											send(results[i].phone, messages[results[i].districtId])
										}
									})
							} })
					})
				}
			}
		})
	},

	findInvOrRc: function (name, areaId, invCb, rcCb) {
		var self = this
		inv.find(name, areaId, (error, results) => {	
			if(results.length) {
				invCb(error, results)
			} else {
				unit.find(areaId, (error, results) => {
					rc.find(name, results[0].unitId, rcCb)
				})
			}
		})
	},
}