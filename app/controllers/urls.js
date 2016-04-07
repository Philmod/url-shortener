const path = require('path');
const urlLib = require('../lib/url');

module.exports = app => {

  const errors = app.errors;
  const models = app.set('models');
  const Url = models.Url;

  const index = (req, res, next) => {
    res.render('index.hbs');
  };

  const insert = (req, res, next) => {
    var url = req.body.url;
    Url.shortenAndInsert(url, (err, shortUrl) => {
      if (err) return next(err);
      else {
        res.render('shorten_success.hbs', {
          shortUrl: shortUrl
        });
      }
    });
  }

  const redirect = (req, res, next) => {
    var id = req.params.id;
    Url.getById(id, (err, url) => {
      if (err) return callback(err);
      if (!url) return next(new errors.NotFound('This short url does not exist'));
      else {
        Url.incrementView(id, 1); // Async
        return res.redirect(url.fullUrl);
      }
    });
  }

  return {
    index: index,
    insert: insert,
    redirect: redirect,
  }
}
