module.exports = app => {

  const errors = app.errors;
  var memory = {}

  const insert = (url, id, callback) => {
    var error;
    if (memory[id]) {
      if (memory[id] === url) {
        error = new errors.ConflictError('This url has be shortUrlened already.');
      } else {
        error = new errors.ConflictError('Collision');
      }
    } else {
      memory[id] = url;
    }
    return callback(error, id);
  }

  const getById = (id, callback) => {
    return callback(null, memory[id]);
  }

  return {
    insert: insert,
    getById: getById
  }
}
