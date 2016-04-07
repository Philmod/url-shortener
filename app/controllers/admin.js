const auth = require('basic-auth');
const config = require('config');

module.exports = (app) => {

  const errors = app.errors;
  const models = app.set('models');
  const Url = models.Url;

  /**
   * Return the admin page.
   */
  const index = (req, res, next) => {
    Url.getAll((err, urls) => {
      res.render('admin.hbs', {
        urls: urls
      });
    });
  }

  /**
   * Return the login page.
   */
  const login = (req, res, next) => {
    res.render('login.hbs');
  }

  /**
   * Check the login information submitted.
   * Redirect to admin if success.
   */
  const loginSubmitted = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === config.admin.username && password === config.admin.password) {
      req.session.regenerate(err => {
        if (err) return next(err);
        req.session.user = username;
        res.redirect('/admin');
      });
    } else {
      next(new errors.Unauthorized('The username and password do not match.'));
    }
  }

  /**
   * Check if the request has an identified session.
   */
  const checkAuth = (req, res, next) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      next();
    }
  }

  /**
   * Basic authentification check.
   */
  const basicAuth = (req, res, next) => {
    var user = auth(req);
    if (!user
      || user.name !== config.admin.username
      || user.pass !== config.admin.password) {
      next(new errors.Unauthorized('The username and password do not match.'));
    } else {
      next();
    }
  }

  return {
    index: index,
    login: login,
    loginSubmitted: loginSubmitted,
    checkAuth: checkAuth,
    basicAuth: basicAuth,
  }

}
