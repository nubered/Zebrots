var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mysql/queries');

var app = express();
app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json()); // augment the req with body property which will have json from the post's body
app.use(bodyParser.urlencoded({ extended: false }));

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

app.listen(app.get('port'), function() {
  console.log('Began listening on port' + app.get('port') + ' at ', timeFormat(new Date()));
});


// THING KURT ADDED TO MAKE EASILY-READABLE TIME-STAMPS ON THE SERVER-START MESSAGES:

timeFormat = function(time) {
  let hours   = zeroes(time.getHours());
  let minutes = zeroes(time.getMinutes());
  let seconds = zeroes(time.getSeconds());
  let timeString = hours + ':' + minutes + ':' + seconds;

  function zeroes(number) {
    return (number < 10) ? '0' + number : number;
  }
  return timeString;
}
