const config = require('config');
const _ = require('lodash');

module.exports = {

  unwrapDocument: (doc) => {
    if (!doc) return;
    var obj = {};
    _.forOwn(doc, function(value, key) {
      _.forOwn(value, function(value, type) {
        obj[key] = value;
      });
    });
    return obj;
  }

}
