
var hasSession = function(req) {
  return req.session.uid !== undefined;
};

module.exports = {
  hasSession: hasSession
};
