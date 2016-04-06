module.exports = app => {

  const errors = app.errors;
  var memory = {}

  const insert = (url, short, callback) => {
    var error;
    if (memory[short]) {
      if (memory[short] === url) {
        error = new errors.ConflictError('This url has be shortened already.');
      } else {
        error = new errors.ConflictError('Collision');
      }
    } else {
      memory[short] = url;
    }
    return callback(error);
  }

  return {
    insert: insert
  }
}
