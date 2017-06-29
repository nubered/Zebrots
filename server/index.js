var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mysql/queries');
var gitHub = require('../server/github.config');
var promise = require('bluebird');
var request = promise.promisifyAll(require('request'));
var queryString = require('querystring');
var path = require('path');
var fs = require('fs');


var app = express();
app.use(express.static(__dirname + '/../react-client/dist')); // if after session, causes err-content-length-mismatch??

var morgan = require('morgan'); // morgan is used for logging. See access.log in the current directory
var accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), {flags: 'a'}
);
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

var session = require('express-session');
var FileStore = require('session-file-store')(session); // creates a folder called sessions for saving session info
app.use(session({
  name: 'server-session-cookie-id',
  secret: 'gravitas is good',
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));

app.use(bodyParser.json()); // augment the req with body property which will have json from the post's body
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/redirect', function (req, res) {

  res.redirect('/');

});

app.get('/login*', function (req, res) {

  let user = {
    avatar_url: '',
    login: '',
    email: '',
    github_token: ''
  };

  let options = { // used when hitting github's endpoints
    url: '',
    headers: {
      'User-Agent': 'request',
      'Accept': 'application/json',
      'Authorization': ''
    }
  };

  let url = 'https://github.com/login/oauth/access_token';
  let formData = {
    client_id: gitHub.clientId,
    client_secret: gitHub.clientSecret,
    code: req.query.code
  };

  // get auth token from github
  request.postAsync({url, formData})
    .then(({body}) => {
      user.github_token = queryString.parse(body).access_token;
      options.url = 'https://api.github.com/user/emails'; // this will get private emails
      options.headers.Authorization = `token ${user.github_token}`;

      return request.getAsync(options);
    })
    .then(({body}) => {
      let {email} = JSON.parse(body)[0];
      user.email = email; // save user email
      options.url = 'https://api.github.com/user';

      return request.getAsync(options);
    })
    .then(({body}) => {
      let {avatar_url,login} = JSON.parse(body);
      user.avatar_url = avatar_url; // save user avatar
      user.login = login; // save user name

      // check if user exists
      return db.selectUser({field: 'email', value: user.email});
    })
    .then(userDB => {
      if(!userDB.length) { // no user, create a new user
        return db.createUser(user)
      } else { // we have a user, return id
        return userDB[0].id;
      }
    })
    .then((userId) => { // userId will be a row or the id
      userId = parseInt(userId) ? userId : userId.insertId;
      req.session.uid = userId; // save the user id in the session
      res.redirect("/"); // redirect user back to home page
    })
    .catch(err => {
      console.error('Ooops, we had an error: ', err);
      res.status(500).end();
    })
});

app.get('/session', function (req, res) {

  let userSession = {uid: req.session.uid || null};
  if (!userSession.uid) {
    res.status(200).end(JSON.stringify(userSession));
  } else {
    db.selectUser({field: 'id', value: userSession.uid})
      .then(user => {
        if(user.length) { // user found; set the handle
          userSession.handle = user[0].handle;
        } else { // user not found in db; clear session id
          userSession.uid = null;
        }
        res.send(JSON.stringify(userSession));
      })
      .catch(err => {
        console.error('we have a error ', err);
        res.status(500).end();
      });
  }
});

app.get('/users', function (req, res) {

  console.log('users get');
  db.selectAll()
    .then(results => {
      console.log('these are the results from /users get', results);
      res.status(200).end(JSON.stringify(results));
    })
    .catch(err => {
      console.error('we have an error ', err);
      res.status(500).end();
    });
});

app.post('/users', function (req, res) {
  console.log('users post');
  db.addUser(req.body)
    .then(results => {
      console.log('these are the results from /users post ', results);
      res.status(201).end();
    })
    .catch(err => {
      console.error('we have an error ', err);
      res.status(500).end();
    });
});

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
  console.log('Began listening on port' + app.get('port') + ' at ', timeFormat(new Date()));
});


// THING KURT ADDED TO MAKE EASILY-READABLE TIME-STAMPS ON THE SERVER-START MESSAGES:

let timeFormat = function(time) {
  let hours   = zeroes(time.getHours());
  let minutes = zeroes(time.getMinutes());
  let seconds = zeroes(time.getSeconds());
  let timeString = hours + ':' + minutes + ':' + seconds;

  function zeroes(number) {
    return (number < 10) ? '0' + number : number;
  }
  return timeString;
};
