var queryDB = (name, fn, res, method = 'GET') => {
  fn()
    .then(results => {
      console.log('these are the results from the query to the db ', results);
      if(method === 'POST') {
        res.status(201).end();
        return;
      }

      let objState = {};
      objState[name] = results;
      res.status(200).end(JSON.stringify(objState));
    })
    .catch(err => {
      console.error('we have a error ', err);
      res.status(500).end();
    });
};

module.exports = {
  queryDB: queryDB
};
