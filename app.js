var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var dbUtils = require('./db/utils')

var app = express()

var passport = require('passport')

var db = require('./db/index.js')
db.connect()

function resendText () {
var params = text.split('! ')
  dbUtils.findArea(req.body.From, (error, results) => {
    var action = params.shift().toLowerCase()
    twilioRoute[action](params, results[0].id, req.body.From, (error, response) => {
      if (error) { console.error(error) }
      if (response) { 
        var twiml = new twilio.TwimlResponse()
        twiml.message(response)
        response = twiml.toString()
      }
      res.send(response)
    })
  })
}




// setup scheduler
var schedule = require('node-schedule')
var j = schedule.scheduleJob( {hour: 21, minute: 15, dayOfWeek: 4}, function() { dbUtils.sendNumbers() } )

// session setup
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)
var store = new MySQLStore({
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }}}, db)

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: store,
  resave: true,
  saveUninitialized: true
}))

// Initializes Passport
app.use(passport.initialize())
app.use(passport.session())

// setup routes
var routes = require('./routes/index.js')(app)

var sheets = require('./sheets/utils.js')

require('./auth/index.js')(passport)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404;
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send()
})

module.exports = app
