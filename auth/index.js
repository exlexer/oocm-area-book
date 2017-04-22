var LocalStrategy   = require('./passport-local').Strategy;
var SHA256 = require("crypto-js/sha256");

var db = require('../db');

module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      db.query("SELECT * FROM missionaries WHERE id = ?",
          [id],
          function(err,rows){   
              done(err, rows[0]);
      });
  });
  
  // =========================================================================
  // LOCAL LOGIN AND SIGNUP ==================================================
  // =========================================================================

  passport.use('local-login', new LocalStrategy({
    passReqToCallBack: true
  },
  function (req, username, password, done) {
    password = SHA256(password).toString();

    db.query("SELECT * FROM missionaries WHERE email = ?",
        [username],
        function (error, results, fields){
          if (error)
            return done(error);
          if (!results.length) {
            return done(null, false);
          }
        
          // if the user is found but the password is wrong
          if (results[0].password !== password) {
            return done(null, false);
          }

          // all is well, return successful user
          return done(null, results[0]);           
        }); 
    }))
  .use('local-signup', new LocalStrategy({
    passReqToCallBack: true
  },
  function (req, username, password, done) {

    console.log(req, username, password, done);

    password = SHA256(password).toString();

    var newUserMysql = new Object();
    newUserMysql.username = username;
    newUserMysql.name = req.bodyname;
    newUserMysql.password = password;

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    db.query("SELECT * FROM missionaries WHERE email = ?",
      [username],
      function (error, results, fields){
        console.log(results);
        if (error)
          return done(error);
        if (results.length) {
          if(!results[0].password) {
            db.query(
              'UPDATE missionaries SET password = ?, name = ? WHERE email = ?',
              [password, req.body.name, username],
              function (error, results, fields) {
                console.log(results);
                newUserMysql.id = results[0].id;
                return done(null, newUserMysql);
              });
          } else {
            return done(null, false);
          }
        } else {

          // if there is no user with that username
          // create the user
      
          db.query(
            "INSERT INTO missionaries ( email, password, name ) VALUES (?,?,?)",
            [username, password, req.body.name],
            function (error, results, fields){
              newUserMysql.id = results.insertId;
              return done(null, newUserMysql);
          });
        }   
    });
  }));
};