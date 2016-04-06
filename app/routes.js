const serverStatus = require('express-server-status');

module.exports = (app) => {

  /**
   * Status.
   */
  app.use('/status', serverStatus(app));

}
