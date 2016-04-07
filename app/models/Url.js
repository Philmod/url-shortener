'use strict';
const uuid = require('node-uuid');
const config = require('config');
const urlLib = require('../lib/url');
const dynamoLib = require('../lib/dynamo');
const _ = require('lodash');

const NB_CHAR = 6; // Size of the unique id

/**
 * Url dynamo model [types].
 */
var dynamoModel = {
  date: 'S',
  id: 'S',
  viewCount: 'N',
  shortUrl: 'S',
  fullUrl: 'S'
};

/**
 * Local cache.
 */
class Cache {
  constructor() {
    this.memory = {}
  }
  get(id) {
    return this.memory[id];
  }
  set(id, data) {
    this.memory[id] = data
  }
}

/**
 * Model.
 */
module.exports = app => {

  const errors = app.errors;
  var dynamoParams = {TableName: config.database.tableName};

  /**
   * Local cache to limit access to Database.
   */
  var idToUrl = new Cache();

  /**
   * Insert a new url / id pair in the database.
   *
   * @param {String} url
   * @param {String} id
   * @return {Function} Callback function
   */
  const insert = (url, id, callback) => {
    if (idToUrl[id]) {
      return callback(new errors.ConflictError('Collision'));
    } else {
      var data = {
        id: id,
        shortUrl: urlLib.constructShortUrl(id),
        fullUrl: url,
        date: new Date().toString(),
        viewCount: 0
      };
      var params = _.extend(_.cloneDeep(dynamoParams), {
        Item: dynamoLib.wrapObject(data, dynamoModel)
      });

      app.dynamodb.putItem(params, (err) => {
        if (err) return callback(err);
        else {
          idToUrl.set(id, data);
          return callback(null, id);
        }
      });
    }
  }

  /**
   * Get a unique id.
   *
   * @return {Function} Callback function
   */
  const getRandomUniqueId = callback => {
    var id = uuid.v1().substr(0, NB_CHAR);
    getById(id, (err, url) => {
      if (err) return callback(err);
      if (!url) return callback(null, id);
      else return getRandomUniqueId(callback);
    });
  }

  /**
    * Get a unique id and insert in the database.
    *
    * @param {String} url
    * @return {Function} Callback function
    */
  const shortenAndInsert = (url, callback) => {
    getRandomUniqueId((err, id) => {
      if (err) return callback(err);
      insert(url, id, (err, id) => {
        var shortUrl = urlLib.constructShortUrl(id);
        callback(err, shortUrl);
      });
    });
  }

  /**
    * Get item by id.
    *
    * @param {String} id
    * @return {Function} Callback function
    */
  const getById = (id, callback) => {
    var local = idToUrl.get(id);
    if (local) return callback(null, local);

    // Dynamo object
    var params = _.extend(_.cloneDeep(dynamoParams), {
      KeyConditionExpression: "id = :v1",
      ExpressionAttributeValues: {
        ":v1": {S: id}
      },
      Limit: 1,
      ConsistentRead: true
    });

    app.dynamodb.query(params, (err, data) => {
      if (err) return callback(err);
      else {
        var item = dynamoLib.unwrapDocument(data.Items[0]);
        idToUrl.set(id, item);
        return callback(null, item);
      }
    });
  }

  /**
    * Get all items.
    *
    * @return {Function} Callback function
    */
  const getAll = (callback) => {
    var items = [];

    function onScan(err, data) {
      if (err) return callback(err);
      else {
        // Store the new retrieved items.
        data.Items.forEach(function(item) {
         items.push(dynamoLib.unwrapDocument(item));
        });

        // Continue scanning if there are more.
        if (typeof data.LastEvaluatedKey != "undefined") {
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          app.dynamodb.scan(dynamoParams, onScan);
        } else {
          return callback(null, items);
        }
      }
    }
    app.dynamodb.scan(dynamoParams, onScan);
  }

  /**
    * Increment the number of view of a shortened url (id) by n.
    *
    * @param {String} id
    * @param {Number} n
    * @return {Function} Callback function
    */
  const incrementView = (id, n, callback) => {
    var params = _.extend(_.cloneDeep(dynamoParams), {
      Key: {
        id: {S: id}
      },
      UpdateExpression: "set viewCount = viewCount + :val",
      ExpressionAttributeValues:{
          ":val": {N: n.toString()}
      },
      ReturnValues:"UPDATED_NEW"
    });
    app.dynamodb.updateItem(params, (err, data) => {
      if (callback) return callback(err, data);
    });
  }

  /**
   * Clear local cache.
   */
  const clearCache = () => {
    idToUrl = new Cache();
  }

  return {
    insert: insert,
    shortenAndInsert: shortenAndInsert,
    getById: getById,
    getAll: getAll,
    incrementView: incrementView,
    clearCache: clearCache
  }
}
