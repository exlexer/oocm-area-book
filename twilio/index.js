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
				dbUtils.findUnits(from, function (error, results, fields) {
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
				dbUtils.findUnits(from, function (error, results, fields) {
						console.log(params[2], results[0].unitId, params[1]);
						db.query(
							'UPDATE rc SET vters = ? WHERE name = ? AND unitId = ?',
							[params[2], params[1], results[0].unitId],
							blankCb
						);
				});
				break;

			case 'bap':
				dbUtils.findInv(params[1], from, function (error, results, fields) {
					var inv = results[0];
					// insert inv into rc w/ bap date
					dbUtils.findUnits(from, function (error, results, fields) {
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
				dbUtils.findInv(params[1], from, function (error, results, fields) {
					db.query(
						'UPDATE inv SET bd = ? WHERE id = ?',
						[params[2], results[0].id],
						blankCb);
				});
				break;

			case 'temple':
				// insert bd into inv
				dbUtils.findRc(params[1], from, function (error, results, fields) {
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
						function (error, results) {
							dbUtils.invAtChurch(results[0].id, blankCb)
						}, function (error, results, fields) {
							dbUtils.rcAtChurch(results[0].id, blankCb);		
						});
					};
				break;

			default:
				// error handling
				break;
		}
	})
};


function blankCb(error, results, fields) {
	if (error) { console.log(error) };
};

function findInvOrRc(name, areaId, invCb, rcCb) {
	dbUtils.findInv(name, areaId, function (error, results, fields) {	
		if(results.length) {
			dbUtils.invCb(error, results, fields);
		} else {
			dbUtils.findUnits(areaId, function (error, results, fields) {
				dbUtils.findRc(name, results[0].unitId, rcCb);
			});
		};
	});
};

function numbering(startTime, endTime) {
  var startTime = "2017-4-19T00:00:00",
      endTime = "2017-4-19T23:59:59",
      nums = new Object;

  var Num = function () {
  	this.ni = 0;
  	this.bd = 0;
  	this.lessons = 0;
  	this.bap = 0;
  };

  dbUtils.weekNewInv(startTime, endTime, function (error, results) {
      for (var i = 0; i < results.length; i++) {

        nums[results[i].areaId] = nums[results[i].areaId] || new Num;
        nums[results[i].areaId].ni++;

        if (results[i].bd) { nums[results[i].areaId].bd++ };
      };
    });
    dbUtils.weekLessons(startTime, endTime, function (error, results) {
      for (var i = 0; i < results.length; i++) {
        nums[results[i].areaId] = nums[results[i].areaId] || new Num;
       	nums[results[i].areaId].lessons ++;
      };
      dbUtils.insertNums(nums);
    });
};