var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mysql/queries');

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json()); // augment the req with body property which will have json from the post's body
app.use(bodyParser.urlencoded());

app.get('/users', function (req, res) {
  db.selectAll()
    .then(results => {
      console.log('these are the results from /users get', results);
      res.status(200).end(JSON.stringify(results));
    })
    .catch(err => {
      console.error('we have a error ', err);
      res.status(500).end();
    });
});

app.post('/users', function (req, res) {
  db.addUser(req.body)
    .then(results => {
      console.log('these are the results from /users post ', results);
      res.status(201).end();
    })
    .catch(err => {
      console.error('we have a error ', err);
      res.status(500).end();
    });
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

