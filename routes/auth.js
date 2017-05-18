'use strict';

var db = require('../db/index.js')
var passport = require('passport')

module.exports = function(app) {

	app.route('/auth/isAuthenticated')
		.get(function (req, res) {
		  var authorized = {}
		  authorized.auth = req.isAuthenticated()
		  res.json(authorized)
		})

	app.route('/logout')
		.get(function (req, res){
	  	req.logout()
	  	res.redirect('/')
		})

	app.route('/login')
		.post(passport.authenticate('local-login', {
  		failureRedirect: '/',
	    successRedirect: '/',
		}))

	app.route('/signup')
		.post(passport.authenticate('local-signup', {
  		failureRedirect: '/',
	    successRedirect: '/',
		}))
}