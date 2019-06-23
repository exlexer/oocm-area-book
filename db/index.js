var mysql = require('mysql')

var options

if (process.env.RDS_HOSTNAME) {
	options = {
	  host : process.env.RDS_HOSTNAME,
	  port : process.env.RDS_PORT,
	  user : process.env.RDS_USERNAME,
	  password : process.env.RDS_PASSWORD,
	  database : process.env.RDS_DB_NAME
	}
} else {
	options = {
		host : 'HOST HERE',
	  	port : '3306',
	  	user : 'USER HERE',
	  	password : 'PASSWORD HERE',
	  	database : 'DATABASE HERE'
	}
}


module.exports = mysql.createConnection(options)
