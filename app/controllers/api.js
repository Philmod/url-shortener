const path = require('path');
const uuid = require('node-uuid');
const urlLib = require('../lib/url');

module.exports = app => {

  const errors = app.errors;
  const models = app.set('models');
  const Url = models.Url;

  const shortenUrl = (req, res, next) => {
    var url = req.body.url;
    Url.shortenAndInsert(url, (err, shortUrl) => {
      if (err) return next(err);
      else return res.send(shortUrl);
    });
  }

  const getById = (req, res, next) => {
    var id = req.params.id;
    Url.getById(id, (err, data) => {
      if (err) return next(err);
      else if (!data) return next(new errors.NotFound());
      else return res.send(data);
    });
  }

  const getAll = (req, res, next) => {
    Url.getAll((err, data) => {
      if (err) return next(err);
      else return res.send(data);
    });
  }

  return {
    shortenUrl: shortenUrl,
    getById: getById,
    getAll: getAll
  }
}
