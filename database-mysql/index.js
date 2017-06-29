var mysql = require('mysql');

var connectTo = process.env.JAWSDB_URL || {
  host     : 'localhost',
  user     : 'root',
  password : 'chon',
  database : 'gravitas'
};

var connection = mysql.createConnection(connectTo);

connection.connect(function(err) {
  if (err) {
    console.log('Error connecting to mysql database');
    throw err;
  }
  console.log("Connected to mysql database!");
});

module.exports = connection;
