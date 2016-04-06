const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');

module.exports = function(app) {

  // Views rendering.
  app.engine('hbs', exphbs());
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '../views'));

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
