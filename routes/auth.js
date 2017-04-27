'use strict';

var db = require('../db/index.js'),
		passport = require('passport');

module.exports = function(app) {

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
}