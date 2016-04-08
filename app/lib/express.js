const config = require('config');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = function(app) {

  // Views rendering.
  app.engine('hbs', exphbs());
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '../views'));

  // Sessions.
  var options = {
    client: app.redis
  };
  app.use(session({
    store: new RedisStore(options),
    secret: config.secret,
    resave: false,
    saveUninitialized: true
  }));

  // Body parser.
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Cors.
  app.use(cors());

  // Logs.
  app.use(morgan(config.logger));

  // Error handling.
  app.use(errorhandler());

}
