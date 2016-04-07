const config = require('config');
const _ = require('lodash');

module.exports = {

  /**
   * Unwrap a document from DynamoDB.
   *
   * @param {Object} doc DynamoDB document
   * @return {Object} Javascript Object.
   */
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

  /**
   * Wrap an js object into a DynamoDB document
   * specifying the type for each property.
   *
   * @param {Object} obj Javascript Object
   * @param {Object} model Properties types
   * @return {Object} DynamoDB document
   */
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
