const urlLib = require('../lib/url');

module.exports = app => {

  const errors = app.errors;
  var idToUrl = {};
  var urlToId = {};

  const insert = (url, id, callback) => {
    var error;
    if (urlToId[url]) {
      id = urlToId[url];
    }
    else if (idToUrl[id]) {
      error = new errors.ConflictError('Collision');
    } else {
      idToUrl[id] = {
        id: id,
        shortUrl: urlLib.constructShortUrl(id),
        fullUrl: url,
        views: 0
      };
      urlToId[url] = id;
    }
    return callback(error, id);
  }

  const getById = (id, callback) => {
    return callback(null, idToUrl[id]);
  }

  const getAll = (callback) => {
    return callback(null, idToUrl)
  }

  return {
    insert: insert,
    getById: getById,
    getAll: getAll
  }
}
