var db = require('./index');

var queryDatabase = function(query) {
  return new Promise((resolve, reject) => {
    db.query(query, function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

var selectAll = function() {
  return queryDatabase('SELECT handle, email, avatar_url FROM users');
};

var createUser = function(user) {
  return queryDatabase(`INSERT INTO users (id, handle, email, avatar_url, github_token)  
                        VALUES (null, '${user.login}', '${user.email}', '${user.avatar_url}', '${user.github_token}')`);
};

var selectUser = function(user) {
  return queryDatabase(`SELECT * FROM users WHERE users.email = '${user.email}'`);
};

// CREATE TABLE users (
//   id int NOT NULL AUTO_INCREMENT,
//   name varchar(30) NOT NULL,
//   email varchar(50) NOT NULL,
//   gitHub varchar(200) NOT NULL,
//   PRIMARY KEY (ID)
// );
// let user = {
//     avatar_url: '',
//     login: '',
//     email: ''
//   };
module.exports = {
  selectAll: selectAll,
  selectUser: selectUser,
  createUser: createUser
};
