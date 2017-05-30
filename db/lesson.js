var db = require('./index')

module.exports = {
	get: function (missionaryId, cb) {
	  db.query(
	    'SELECT l.summary, l.lesson, l.OrderDate, rc.id, rc.unitId, rc.name FROM lessons l '+
	    'INNER JOIN rc ON l.rcId = rc.id '+
	    'LEFT JOIN area_unit au ON rc.unitId = au.unitId '+
	    'LEFT JOIN missionaries m ON au.areaId = m.areaId '+
	    'WHERE m.id = ? '+
	    'UNION '+
	    'SELECT l.summary, l.lesson, l.OrderDate, inv.id, inv.areaId, inv.name FROM lessons l '+
	    'INNER JOIN inv ON l.invId = inv.id '+
	    'LEFT JOIN missionaries m ON inv.areaId = m.areaId '+
	    'WHERE m.id = ? '+
	    'UNION '+
	    'SELECT l.summary, l.lesson, l.OrderDate, f.id, f.areaId, f.name FROM lessons l '+
	    'INNER JOIN former f ON l.formerId = f.id '+
	    'LEFT JOIN missionaries m ON f.areaId = m.areaId '+
	    'WHERE m.id = ?',
    	[missionaryId, missionaryId, missionaryId], cb)},
	update: function (invId, rcId, formerId, type, typeId, cb) {
		db.query('UPDATE lessons SET invId = ?, rcId = ?, formerId = ?  WHERE ? = ?',
			[invId, rcId, formerId, type, typeId], cb)},
}