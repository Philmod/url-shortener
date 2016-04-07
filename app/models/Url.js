'use strict';
const uuid = require('node-uuid');
const config = require('config');
const urlLib = require('../lib/url');
const dynamoLib = require('../lib/dynamo');
const _ = require('lodash');

const NB_CHAR = 6; // Size of the unique id

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
   * Insert into Database.
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
        Item: {
          id: {S: data.id},
          shortUrl: {S: data.shortUrl},
          fullUrl: {S: data.fullUrl},
          date: {S: data.date},
          viewCount: {N: data.viewCount.toString()}
        }
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
   * Get a unique id and insert.
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
   */
  const getById = (id, callback) => {
    var local = idToUrl.get(id);
    if (local) return callback(null, local);

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
   */
  const getAll = (callback) => {
    var items = [];

    function onScan(err, data) {
        if (err) return callback(err);
        else {
            data.Items.forEach(function(item) {
               items.push(dynamoLib.unwrapDocument(item));
            });

            // continue scanning if there are more.
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
   * Increment the number of view of a shortened url by n.
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
