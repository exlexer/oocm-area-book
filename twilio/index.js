var db = require('../db/index'),
		dbUtils = require('../db/utils');


module.exports = function (phone, message, cb) {
	
	var params = message.split('! '),
			route = params[0].toLowerCase();


	dbUtils.findArea(phone, function (error, results) {
		var from = results[0].id;

		switch (route) {
			case 'ni':
				dbUtils.newInv(params[1], params[2], from, cb);
				break;

			case 'lesson':
				findInvOrRc(params[1], from,
				function (error, results) {
					db.query(
						'INSERT INTO lessons (summary, lesson, invId) VALUES (?,?,?)',
						[params[2], params[3], results[0].id], cb);
				}, function (error, results) {
					db.query(
						'INSERT INTO lessons (summary, lesson, rcId) VALUES (?,?,?)',
						[params[2], params[3], results[0].id], cb);
				})
				break;

			case 'ht':
				// insert hters names into recent converts
				dbUtils.findUnits(from, function (error, results) {
						console.log(params[2], results[0].unitId, params[1]);	
						db.query(
							'UPDATE rc SET hters = ? WHERE name = ? AND unitId = ?',
							[params[2], params[1], results[0].unitId],
							cb
						);
				});
				break;

			case 'vt':
				// insert vters names into recent converts
				dbUtils.findUnits(from, function (error, results) {
						console.log(params[2], results[0].unitId, params[1]);
						db.query(
							'UPDATE rc SET vters = ? WHERE name = ? AND unitId = ?',
							[params[2], params[1], results[0].unitId],
							cb
						);
				});
				break;

			case 'bap':
				dbUtils.findInv(params[1], from, function (error, results) {
						console.log(error, results);
					dbUtils.bapInv(results[0], from, function (error, results) {
					});
				});
				break;

			case 'bd':
				// insert bd into inv
				dbUtils.findInv(params[1], from, function (error, results) {
					db.query(
						'UPDATE inv SET bd = ? WHERE id = ?',
						[params[2], results[0].id],
						cb);
				});
				break;

				// not setup yet
			case 'temple':
				// insert bd into inv
				// dbUtils.findRc(params[1], from, function (error, results) {
				// 	db.query(
				// 		'UPDATE inv SET bd = ? WHERE id = ?',
				// 		[params[2], results[0].id],
				// 		cb);
				// });
				break;

			case 'church':
				// cycle through rest of params
				for (var i = 1; i < params.length; i++) {
					// add instance in church_attend as either RC or Inv
					findInvOrRc(params[i], from,
						function (error, results) {
							dbUtils.invAtChurch(results[0].id, cb)
						}, function (error, results) {
							dbUtils.rcAtChurch(results[0].id, cb);		
						});
					};
				break;

			case 'drop':
				dbUtils.findInv(params[1], from, function (error, results) {
					dbUtils.dropInv(results[0], params[2], function (error, results) {
						console.log(results);
					});
				});


				break;

			case 'pickup':
				dbUtils.findFormer(params[1], from, function (error, results) {
					dbUtils.pickupInv(results[0], params[2], function (error, results) {
						console.log(results);
					});
				});


				break;

			default:
				// error handling
				break;
		}
	})
};

function findInvOrRc(name, areaId, invCb, rcCb) {
	dbUtils.findInv(name, areaId, function (error, results) {	
		if(results.length) {
			invCb(error, results);
		} else {
			dbUtils.findUnits(areaId, function (error, results) {
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