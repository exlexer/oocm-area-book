var mysql = require('mysql');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".
var options;

var devOptions = {
	host : 'aa4qb7hf7vsrnu.cvomhhylmjnk.us-west-2.rds.amazonaws.com',
  port : '3306',
  user : 'oocm',
  password : 'masterpass',
  database : 'ebdb'
}



if (process.env.RDS_HOSTNAME) {
	options = {
	  host : process.env.RDS_HOSTNAME,
	  port : process.env.RDS_PORT,
	  user : process.env.RDS_USERNAME,
	  password : process.env.RDS_PASSWORD,
	  database : process.env.RDS_DB_NAME
	};
} else{
	options = {
	  host:"localhost",
    user:"root",
	  password: "root",
	  database: "project"
	};
};


module.exports = mysql.createConnection(options);