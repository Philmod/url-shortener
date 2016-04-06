const path = require('path');
const uuid = require('node-uuid');
const urlLib = require('../lib/url');

module.exports = app => {

  const errors = app.errors;
  const models = app.set('models');
  const Url = models.Url;

  const index = (req, res, next) => {
    res.render('index.hbs');
  };

  const getRandomUniqueId = callback => {
    var id = uuid.v1().substr(0, 6);
    Url.getById(id, (err, url) => {
      if (err) return callback(err);
      if (!url) return callback(null, id);
      else return getRandomUniqueId(callback);
    });
  }

  const constructUrl = id => {
    var url = [config.protocol, '://', config.domain].join('')
    url += (config.port) ? (':' + config.port) : '';
    url += ['/', id].join('');
    return url;
  }

  const _insertFullUrl = (url, callback) => {
    getRandomUniqueId((err, id) => {
      if (err) return callback(err);
      var shortUrl = urlLib.constructShortUrl(id);
      Url.insert(url, id, (err) => {
        callback(err, shortUrl);
      });
    });
  }

  const insert = (req, res, next) => {
    var url = req.body.url;
    _insertFullUrl(url, (err, shortUrl) => {
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
      else return res.redirect(url.fullUrl);
    });
  }

  return {
    index: index,
    insert: insert,
    redirect: redirect
  }
}
