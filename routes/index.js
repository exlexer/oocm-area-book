'use strict';

var db = require('../db/index.js');
var dbRoutes = require('../db/routes.js');
var ssUtils = require('../sheets/utils.js');
var passport = require('passport');
var debug = require('debug')('app');

module.exports = function(app) {

	app.route('/user')
		.get(function (req, res) {
			db.query(
				'SELECT * FROM missionaries WHERE id = ?',
				[req.session.passport.user],
				function (error, results, fields) {
					if (results.length) {
						res.json({
							name : results[0].name,
							email : results[0].email,
							leadership : results[0].leadership
						});
				} else {
					res.send();
				}
				})
		});

	app.route('/auth/isAuthenticated')
		.get(function (req, res) {
		  var authorized = {};
		  authorized.auth = req.isAuthenticated();
		  res.json(authorized);
		});

	app.route('/logout')
		.get(function (req, res){
	  	req.logout();
	  	res.redirect('/');
		});

	// Login Routes ---------------------------------------------------
	app.route('/login')
		.post(passport.authenticate('local-login', {
  		failureRedirect: '/loginFailure',
	    successRedirect: '/',
		}));
	app.route('/loginFailure')
		.get(function (req, res, next) {
		  res.render('index', { title: 'FAILED TO LOGIN' });
		});

	// Signup Routes ---------------------------------------------------
	app.route('/signup')
		.post(passport.authenticate('local-signup', {
    		failureRedirect: '/signupFailure',
		    successRedirect: '/',
  		}));
	app.route('/signupFailure')
		.get(function (req, res, next) {
		  res.render('index', { title: 'FAILED TO SIGNUP' });
		});

	// Find area that send the text and send to data route
	app.route('/message')
		.post(function (req, res) {
			var from = req.body.From,
					params = dbRoutes.parseText(req.body.Body);

			db.query(
				'SELECT id, name FROM areas WHERE phone = ? OR phoneTwo = ?',
				[from, from],
				function(error, results, fields) {
					dbRoutes.routeData(params, results[0].id);
					res.send();
				});
		});

	// Routes to get from and post to the stakes table in the db
	app.route('/stakes')
		.get(function (req, res) {
			db.query(
				'SELECT * FROM stakes',
				function (error, results, fields) {
					res.send(results);
			});
		})
		.post(function (req, res) {
			db.query(
				"INSERT INTO stakes (name) VALUES (?)",
				req.body.name,
				function (error, results, fields) {
					res.send(results);
			});
		});

	// Routes to get from and post to the units table in the db
	app.route('/units')
		.get(function (req, res) {
			db.query('SELECT * FROM units', function (error, results, fields) {
				res.send(results);
			});
		})
		.post(function (req, res) {
			var data = req.body;
			db.query(
				"INSERT INTO units (name, stakeId) VALUES (?,?)",
				[data.name, data.stakeId],
				function (error, results, fields) {
					res.send(results);
			});
		});

	app.route('/unitUpdate')
		.post(function (req, res) {
			var data = req.body;
			if (data.del) {
				db.query(
					'DELETE FROM units WHERE id = ?',
					[data.id],
					function (error, results, fields) {
						res.send()
					})
			} else {
				db.query(
					"UPDATE units SET name = ?, stakeId = ? WHERE id = ?",
					[data.name, data.stakeId, data.id],
					function (error, results, fields) {
						res.send();
				});
			};
		})

	// Routes to get from and post to the zones table in the db
	app.route('/zones')
		.get(function (req, res) {
			db.query(
				'SELECT * FROM zones',
				function (error, results, fields) {
					res.send(results);
			});
		})
		.post(function (req, res) {
					console.log(req.body)
			db.query(
				"INSERT INTO zones (name, stakeId) VALUES (?, ?)",
				[req.body.name, req.body.stakeId],
				function (error, results, fields) {
					console.log(error)
					res.send(results);
			});
		});

	// Routes to get from and post to the districts table in the db
	app.route('/districts')
		.get(function (req, res) {
			db.query(
				'SELECT * FROM districts',
				function (error, results, fields) {
					res.send(results);
			});
		})
		.post(function (req, res) {
			console.log(req.body);
			if (req.body.update) {
				db.query(
					"UPDATE districts SET zoneId = ? WHERE id = ?",
					[req.body.zoneId, req.body.id],
					function (error, results, fields) {
						debug(error, results);
						console.log(error, results);
						res.send(results);
				});
			} else {
				db.query(
					"INSERT INTO districts (name, zoneId) VALUES (?, ?)",
					[req.body.name, req.body.zoneId],
					function (error, results, fields) {
						res.send(results);
				});
			}
		});

	// Routes to get from and post to the areas table in the db
	app.route('/areas')
		.get(function (req, res) {
			db.query('SELECT * FROM areas', function (error, results, fields) {
				res.send(results);
			});
		})
		.post(function (req, res) {
			var data = req.body;
			db.query(
				'INSERT INTO areas (name, phone, phoneTwo, districtId) VALUES (?,?,?,?)',
				[data.name, data.phone, data.phoneTwo, data.districtId],
				function (error, results, fields) {
					if (Array.isArray(data.unitId)) {
						for (var i = 0; i < data.unitId.length; i++) {
							db.query('INSERT INTO area_unit (areaId, unitId) VALUES (?,?)', [results.insertId, data.unitId[i]],	function (error, results, fields) {})
						};
						res.send(results);
					} else {
						db.query(
							'INSERT INTO area_unit (areaId, unitId) VALUES (?,?)',
							[results.insertId, data.unitId],
							function (error, results, fields) {
								res.send(results);
							})
					}
			});
		});

	app.route('/inv')
		.get(function (req, res) {
			db.query('SELECT areaId FROM missionaries WHERE id = ?',
				req.session.passport.user,
				function (error, results, fields) {
					db.query(
						'SELECT * FROM inv WHERE areaId = ?',
						results[0].areaId,
						function (error, results, fields) {
							console.log(error, results);
							res.send(results);
						}
					)
				})
		});

	app.route('/rc')
		.get(function (req, res) {
			db.query('SELECT areaId FROM missionaries WHERE id = ?',
				req.session.passport.user,
				function (error, results, fields) {
					db.query('SELECT * FROM area_unit WHERE areaId = ?',
					results[0].areaId,
					function (error, results, fields) {
						if (!!results) {
							if(results.length) {

							var resp = [],
									len = results.length,
									k = 0;


							for (var i = 0; i < len; i++) {

								db.query(
								
									'SELECT * FROM rc WHERE unitId = ?',
								
									[results[i].unitId],
								
									function (error, results, fields) {
								
										for (var j = 0; j < results.length; j++) {
											resp.push(results[j]);
										};
								
										k++;

										if (k === len) {
											res.send(resp);
										}
									}
								)
							};

						}
						} else {
							res.send();
						}
					}
				)
			})
		});

	// WORKING!
	app.route('/lesson')
		.get(function (req, res) {
			db.query(
		    'SELECT a.unitId, a.areaId FROM area_unit a '+
		    'INNER JOIN missionaries m ON a.areaId = m.areaId '+
		    'WHERE m.id = ?',
				req.session.passport.user,
		    function (error, results, fields) {
		      console.log(error, results);
		      if (results.length) {
					  db.query(
					    'SELECT l.summary, l.lesson, l.OrderDate, rc.id, rc.unitId, rc.name FROM lessons l '+
					    'INNER JOIN rc ON l.rcId = rc.id '+
					    'WHERE rc.unitId = ? '+
					    'UNION '+
					    'SELECT l.summary, l.lesson, l.OrderDate, inv.id, inv.areaId, inv.name FROM lessons l '+
					    'INNER JOIN inv ON l.invId = inv.id '+
					    'WHERE inv.areaId = ?',
				    	[results[0].unitId, results[0].areaId],
		    			function (error, results, fields) {
		    				res.send(results);
		      			console.log(error, results);
		    			});
		      }
		    });
		});

	app.route('/numbers')
		.post(function (req, res) {
			db.query('SELECT n.bd, n.ni, n.bap, n.OrderDate FROM nums n INNER JOIN missionaries m ON n.areaId = m.areaId WHERE m.id = ?',
				req.session.passport.user,
				function (error, results, fields) {
					console.log(error, results);
				});
			if (req.body.leadership !== 'miss' || undefined) {
				// get numbers for dominion
			}
		});

	// Routes to get from and post to the missionary table in the db
	app.route('/miss')
		.get(function (req, res) {
			db.query('SELECT * FROM missionaries', function (error, results, fields) {
				var missionaries = [];
				for (var i = 0; i < results.length; i++) {
					missionaries[i] = {
						name: results[i].name,
						email: results[i].email,
						id: results[i].id,
						areaId: results[i].areaId,
						leadership: results[i].leadership
					}
				};
				res.send(missionaries);
			});
		})
		.post(function (req, res) {
			var data = req.body;
			if(req.body.id) {
				db.query(
					'UPDATE missionaries SET name = ?, email = ?, leadership = ?, areaId = ? WHERE id = ?',
					[data.name, data.email, data.leadership, data.areaId, data.id],
					function (error, results, fields) {
						console.log(error, results)
						res.send(results);
					})
			} else {
				db.query(
					'INSERT INTO missionaries (name, email) VALUES (?,?)',
					[data.name, data.email],
					function (error, results, fields) {
						res.send(results);
				});
			}
		});
}