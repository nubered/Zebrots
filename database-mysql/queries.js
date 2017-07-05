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

var selectAllUsers = function(condition) {
  return queryDatabase(`SELECT handle, email, avatar_url FROM users ${condition}`);
};

var selectAll = function(table, condition = '') {
  return queryDatabase(`SELECT * FROM ${table} ${condition}`);
};

var createUser = function(user) {
  return queryDatabase(`INSERT INTO users (id, handle, email, avatar_url, github_token)  
                        VALUES (null, '${user.login}', '${user.email}', '${user.avatar_url}', '${user.github_token}')`);
};

var selectUser = function(attribute) {
  return queryDatabase(`SELECT id, email, handle, avatar_url FROM users WHERE ${attribute.field} = '${attribute.value}'`);
};

var createTopic = function(topic, userId) {
  return queryDatabase(`INSERT INTO topics (user_q_id, topic) VALUES (${userId}, '${topic}')`);
};

var connectTopic = function(topicId, userId, condition = '') {
  return queryDatabase(`UPDATE topics SET user_a_id = ${userId} ${condition}`);
};

var selectAllTakeaways = function() {
  return queryDatabase('SELECT topics.topic, uq.handle, ua.handle from topics ' +
  'JOIN users uq on topics.user_q_id = uq.id' +
  'JOIN users ua on topics.user_a_id = ua.id' +
  'WHERE topics.id = 1');
};

var createTakeaway = function(takeaway) {
  return queryDatabase(`INSERT INTO takeaways (id, takeaway) VALUES (null, '${takeaway}')`);
};

module.exports = {
  selectAllUsers: selectAllUsers,
  selectAll: selectAll,
  selectUser: selectUser,
  createUser: createUser,
  createTopic: createTopic,
  selectAllTakeaways: selectAllTakeaways,
  createTakeaway: createTakeaway,
  connectTopic: connectTopic
};

