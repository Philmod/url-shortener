const urlLib = require('../lib/url');

module.exports = app => {

  const errors = app.errors;
  var memory = {}

  const insert = (url, id, callback) => {
    var error;
    if (memory[id]) {
      if (memory[id].fullUrl === url) {
        error = new errors.ConflictError('This url has be shortUrlened already.');
      } else {
        error = new errors.ConflictError('Collision');
      }
    } else {
      memory[id] = {
        id: id,
        shortUrl: urlLib.constructShortUrl(id),
        fullUrl: url,
        views: 0
      };
    }
    return callback(error, id);
  }

  const getById = (id, callback) => {
    return callback(null, memory[id]);
  }

  const getAll = (callback) => {
    return callback(null, memory)
  }

  return {
    insert: insert,
    getById: getById,
    getAll: getAll
  }
}
