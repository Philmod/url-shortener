const config = require('config');

module.exports = (app) => {

  const errors = app.errors;
  const models = app.set('models');
  const Url = models.Url;

  const index = (req, res, next) => {
    Url.getAll((err, urls) => {
      res.render('admin.hbs', {
        urls: urls
      });
    });
  }

  const login = (req, res, next) => {
    res.render('login.hbs');
  }

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

  const basicAuth = (req, res, next) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      next();
    }
  }

  return {
    index: index,
    login: login,
    loginSubmitted: loginSubmitted,
    basicAuth: basicAuth,
  }

}
