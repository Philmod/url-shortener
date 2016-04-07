const config = require('config');
const _ = require('lodash');

module.exports = {

  unwrapDocument: (doc) => {
    if (!doc) return;
    var obj = {};
    _.forOwn(doc, (value, key) => {
      _.forOwn(value, (value, type) => {
        obj[key] = (type === 'N') ? parseInt(value) : value;
      });
    });
    return obj;
  },

  wrapObject: (obj, model) => {
    if (!obj) return;
    var doc = {};
    _.forOwn(obj, (value, key) => {
      var type = model[key];
      doc[key] = {};
      doc[key][type] = value.toString();
    });
    return doc;
  }

}
