const express = require('express');
const _ = require('lodash');

var NODE_ENV = process.env.NODE_ENV;
const app = express();

if (!NODE_ENV) {
  NODE_ENV = process.env.NODE_ENV = 'development';
}

app.errors = require('./app/lib/errors');

require('./app/lib/express')(app);

app.set('models', require('./app/models')(app));

app.set('controllers', require('./app/controllers')(app));

require('./app/routes')(app);

if (app.set('env') !== 'test' && app.set('env') !== 'circleci') {
  /**
   * Start server
   */
 const port = process.env.PORT || 3070;
  const server = app.listen(port, () => {
    console.log('url-shortener listening at http://localhost:%s in %s environment.', server.address().port, app.set('env'));
  });
}

module.exports = app;
