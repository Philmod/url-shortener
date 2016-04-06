var bodyParser = require('body-parser');
var cors = require('cors');
var errorhandler = require('errorhandler');
var morgan = require('morgan');

module.exports = function(app) {

  // Body parser.
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Cors.
  app.use(cors());

  // Logs.
  app.use(morgan('dev'));

  // Error handling.
  app.use(errorhandler());

}
