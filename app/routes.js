const serverStatus = require('express-server-status');
const errorHandler = require('./middlewares/error_handler');

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
  app.post('/url', urls.insert);

  /**
   * Redirect.
   */
  app.get('/:id', urls.redirect);

  /**
   * Error handler.
   */
  app.use(errorHandler);

}
