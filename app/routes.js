const serverStatus = require('express-server-status');
const errorHandler = require('./middlewares/error_handler');

module.exports = (app) => {

  /**
   * Controllers
   */
  const Controllers = app.set('controllers');
  const urls = Controllers.urls;
  const admin = Controllers.admin;

  /**
   * Status.
   */
  app.use('/status', serverStatus(app));

  /**
   * Main web page to shorten url.
   */
  app.get('/', urls.index);
  app.post('/url', urls.insert);

  /**
   * Admin page.
   */
  app.get('/login', admin.login);
  app.post('/login', admin.loginSubmitted);
  app.get('/admin', admin.basicAuth, admin.index);

  /**
   * Redirect.
   */
  app.get('/:id', urls.redirect);

  /**
   * Error handler.
   */
  app.use(errorHandler);

}
