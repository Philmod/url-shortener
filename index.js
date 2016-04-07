const express = require('express');
const config = require('config');

var NODE_ENV = process.env.NODE_ENV;
const app = express();

if (!NODE_ENV) {
  NODE_ENV = process.env.NODE_ENV = 'development';
}

/**
 * Load the libraries, config, models, controllers, routes.
 */
app.errors = require('./app/lib/errors');
require('./app/lib/config')(app);
require('./app/lib/express')(app);
app.set('models', require('./app/models')(app));
app.set('controllers', require('./app/controllers')(app));
require('./app/routes')(app);


///// TEMP /////
require('lodash').forOwn(process.env, (value, key) => {
  if (key.indexOf('npm') == -1) {
      console.log('ENV variable: ', key, value);
  }
});
////////////////


/**
 * Start server if not test environment.
 */
if (app.set('env') !== 'test' && app.set('env') !== 'circleci') {
 const port = config.port;
  const server = app.listen(port, () => {
    console.log('url-shortener listening at http://localhost:%s in %s environment (node %s).', server.address().port, app.set('env'), process.version);
  });
}

module.exports = app;
