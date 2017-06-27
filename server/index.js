var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mysql/queries');
var gitHub = require('../server/github.config')
var request = require('request');
var queryString = require('querystring');

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json()); // augment the req with body property which will have json from the post's body
app.use(bodyParser.urlencoded());

app.get('/login*', function (req, res) {

  let url = 'https://github.com/login/oauth/access_token';
  var formData = {
    client_id: gitHub.clientId,
    client_secret: gitHub.clientSecret,
    code: req.query.code
  };

  // get auth token from github
  request.post({url, formData}, (err, response, body) => {
    let token = queryString.parse(body);

    var options = {
      url: 'https://api.github.com/user',
      // url: 'https://api.github.com/user/emails',
      headers: {
        'User-Agent': 'request',
        'Accept': 'application/json',
        'Authorization': `token ${token.access_token}`
      }
    };

    request.get(options, (err, response, body) => {
      let userOptions = JSON.parse(body);
      console.log('some response');
      res.status(200).end();
    });

    // get user email and handle using access token
    // check if in database and save / login accordingly.
  });

});

// Accept-Language: en-us
// Accept: application/json
// Authorization: token 83f42..xxx
// Accept-Encoding: gzip, deflate
//
// GET https://api.github.com/user/emails

// access_token
//   :
//   "f62ffa3a0b2ef73b55e8e935e41ae0f67e5772f4"
// scope
//   :
//   "user"
// token_type
//   :
//   "bearer"

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

