var LocalStrategy   = require('./passport-local').Strategy
var SHA256 = require("crypto-js/sha256")

var db = require('../db')

module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM missionaries WHERE id = ?",
      [id], (error, results) => {   
          done(error, results[0])
    })
  })
  
  // =========================================================================
  // LOCAL LOGIN AND SIGNUP ==================================================
  // =========================================================================

  passport.use('local-login', new LocalStrategy({
    passReqToCallBack: true
  }, (req, username, password, done) => {
    password = SHA256(password).toString()

    db.query("SELECT * FROM missionaries WHERE email = ?",
      [username], (error, results) => {
        if (error)
          return done(error)
        if (!results.length) {
          return done(null, false, req.flash('loginMessage', 'No user found.'))
        }
      
        // if the user is found but the password is wrong
        if (results[0].password !== password) {
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))
        }

        // all is well, return successful user
        return done(null, results[0])
      }) 
    }))
  .use('local-signup', new LocalStrategy({
    passReqToCallBack: true
  }, (req, username, password, done) => {

    password = SHA256(password).toString()

    var newUserMysql = new Object()
    newUserMysql.username = username
    newUserMysql.name = req.bodyname
    newUserMysql.password = password

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    db.query("SELECT * FROM missionaries WHERE email = ?",
      [username], (error, results) => {
        if (error) { return done(error) }
        if (results.length) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
        } else {      
          db.query(
            "INSERT INTO missionaries (email, password, name, gender) VALUES (?,?,?,?)",
            [username, password, req.body.name, req.body.gender], (error, results) => {
              newUserMysql.id = results.insertId
              return done(null, newUserMysql)
          })
        }   
    })
  }))
};