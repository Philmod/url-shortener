const serverStatus = require('express-server-status');

module.exports = (app) => {

  /**
   * Controllers
   */
  const Controllers = app.set('controllers');
  const urls = Controllers.urls;

  /**
   * Status.
   */
  app.use('/status', serverStatus(app));

  /**
   * Main web page to shorten url.
   */
  app.get('/', urls.index);

}
