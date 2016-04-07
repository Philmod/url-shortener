const AWS = require('aws-sdk');
const redis = require('redis');
const config = require('config');

module.exports = app => {

  /**
   * AWS Dynamo.
   */
  AWS.config.update(config.get('aws'));
  var options = {};
  if (config.database.endpoint) {
    options.endpoint = config.database.endpoint;
  }
  app.dynamodb = new AWS.DynamoDB(options);

  /**
   * Redis.
   */
  app.redis = redis.createClient(config.redis.port, config.redis.host);
  app.redis.on('error', err => {
    console.error('Redis error ' + err);
  });

};
