var db = require('./index.js'),
		dbUtils = require('../db/utils');


module.exports = function (phone, message, cb) {
	
	var params = message.split('! '),
			route = params[0].toLowerCase();

	dbUtils.findArea(from, function (error, results) {
		var from = results[0].id;

		switch (route) {
			case 'ni':
				dbUtils.newInv(params[1], params[2], from, blankCb);
				break;

			case 'lesson':
				findInvOrRc(params[1], from,
				function (error, results, fields) {
					db.query(
						'INSERT INTO lessons (summary, lesson, invId) VALUES (?,?,?)',
						[params[2], params[3], results[0].id], blankCb);
				}, function (error, results, fields) {
					db.query(
						'INSERT INTO lessons (summary, lesson, rcId) VALUES (?,?,?)',
						[params[2], params[3], results[0].id], blankCb);
				})
				break;

			case 'ht':
				// insert hters names into recent converts
				findUnits(from, function (error, results, fields) {
						console.log(params[2], results[0].unitId, params[1]);	
						db.query(
							'UPDATE rc SET hters = ? WHERE name = ? AND unitId = ?',
							[params[2], params[1], results[0].unitId],
							blankCb
						);
				});
				break;

			case 'vt':
				// insert vters names into recent converts
				findUnits(from, function (error, results, fields) {
						console.log(params[2], results[0].unitId, params[1]);
						db.query(
							'UPDATE rc SET vters = ? WHERE name = ? AND unitId = ?',
							[params[2], params[1], results[0].unitId],
							blankCb
						);
				});
				break;

			case 'bap':
				findInv(params[1], from, function (error, results, fields) {
					var inv = results[0];
					// insert inv into rc w/ bap date
					findUnits(from, function (error, results, fields) {
						// Inserts into incorrect unit
						db.query(
							'INSERT INTO rc (name, bd, unitId, age, gender) VALUES (?,?,?,?,?)',
							[inv.name, inv.bd, results[0].unitId, inv.age, inv.gender],
							function (error, results, fields) {
								db.query(
									'UPDATE lessons SET invId = NULL, rcId = ? WHERE invId = ?',
									[results.insertId, inv.id],
									blankCb
								);
								db.query(
									'DELETE FROM inv WHERE id = ?',
									[inv.id],
									blankCb
								);
								db.query(
									'INSERT INTO bap (areaId, rcId) VALUES (?,?)',
									[from, results.insertId],
									blankCb);
							}
						);
					});
				});
				break;

			case 'bd':
				// insert bd into inv
				findInv(params[1], from, function (error, results, fields) {
					db.query(
						'UPDATE inv SET bd = ? WHERE id = ?',
						[params[2], results[0].id],
						blankCb);
				});
				break;

			case 'church':
				// cycle through rest of params
				for (var i = 1; i < params.length; i++) {
					// add instance in church_attend as either RC or Inv
					findInvOrRc(params[i], from,
						function (error, results, fields) {
							db.query(
								'INSERT INTO church_attend (invId) VALUES (?)',
								[results[0].id],
								blankCb
							);
						},
						function (error, results, fields) {
							db.query(
								'INSERT INTO church_attend (rcId) VALUES (?)',
								[results[0].id],
								blankCb
							);		
						});
					};
				break;

			default:
				// error handling
				break;
		}
	})
};


function findInv(name, areaId, cb) {
	db.query('SELECT * FROM inv WHERE name=? AND areaId=?', [name, areaId], cb)
};

function findRc(name, unitId, cb) {
	db.query('SELECT * FROM rc WHERE name=? AND unitId=?', [name, unitId], cb);
};

// NOT WORKING , area_unit never being added
function findUnits(areaId, cb) {
	db.query('SELECT * FROM area_unit WHERE areaId = ?', areaId, cb);
};

function blankCb(error, results, fields) {
	if (error) { console.log(error) };
};

function reportCb(error, results, fields) {
	console.log(error, results);
};

function findInvOrRc(name, areaId, invCb, rcCb) {
	findInv(name, areaId, function (error, results, fields) {	
		if(results.length) {
			invCb(error, results, fields);
		} else {
			findUnits(areaId, function (error, results, fields) {
				findRc(name, results[0].unitId, rcCb);
			});
		};
	});
};



function numbering(startTime, endTime) {
  var startTime = "2017-4-19T00:00:00",
      endTime = "2017-4-19T23:59:59",
      nums = new Object;

  db.query("select * from inv WHERE OrderDate BETWEEN ? and ?",
    [startTime, endTime],
    function (error,results,fields) {
      for (var i = 0; i < results.length; i++) {
        if (!nums[results[i].areaId]) {
          nums[results[i].areaId] = {ni: 1, bd: 0};
        } else {
          nums[results[i].areaId].ni++;
        };
        if (results[i].bd) {
          nums[results[i].areaId].bd++;
        }
      };
    });
    db.query(
    'SELECT l.summary, a.areaId FROM lessons l '+
    'INNER JOIN rc ON l.rcId = rc.id '+
    'INNER JOIN area_unit a ON rc.unitId = a.unitId '+
    'WHERE l.OrderDate BETWEEN ? and ? '+
    'UNION '+
    'SELECT l.summary, inv.areaId FROM lessons l '+
    'INNER JOIN inv ON l.invId = inv.id '+
    'WHERE l.OrderDate BETWEEN ? and ?',
    [startTime, endTime, startTime, endTime],
    function (error, results, fields) {
      for (var i = 0; i < results.length; i++) {
        if(!nums[results[i].areaId]) {
          nums[results[i].areaId] = {lessons: 1}; 
        } else if(!nums[results[i].areaId].lessons) {
          nums[results[i].areaId].lessons= 1; 
        } else {
          nums[results[i].areaId].lessons++; 
        }
      };
      console.log(nums)
			for(var area in nums) {
	      db.query('INSERT INTO nums (areaId, bd, ni, bap) VALUES (?,?,?,?)',
	      	[area, nums[area].bd, nums[area].ni, nums[area].bap],
	      	function (error, results, fields) {
	      		console.log(error, results);
	      	});
			};
    });
};