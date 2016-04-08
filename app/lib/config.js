const AWS = require('aws-sdk');
const redis = require('redis');
const config = require('config');
const dockerLib = require('./docker');

module.exports = app => {

  /**
   * AWS Dynamo.
   */
  AWS.config.update(config.get('aws'));
  var dynamoHost = dockerLib.getHost('dynamodb');
  var options = {
    endpoint: (dynamoHost) ? ['http://', dynamoHost, ':8000'].join('') : config.database.endpoint
  };
  app.dynamodb = new AWS.DynamoDB(options);

  /**
   * Redis.
   */
  var redisHost = dockerLib.getHost('redis') || config.redis.host;
  app.redis = redis.createClient(config.redis.port, redisHost);
  app.redis.on('error', err => {
    console.error('Redis error ' + err);
  });

};
