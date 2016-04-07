const AWS = require('aws-sdk');
const redis = require('redis');
const config = require('config');

module.exports = app => {

  /**
   * AWS Dynamo.
   */
  AWS.config.update(config.get('aws'));
  var dynamoAddr = process.env.DYNAMODB_PORT_8000_TCP_ADDR;
  var options = {
    endpoint: (dynamoAddr) ? ['http://', dynamoAddr, ':8000'].join('') : config.database.endpoint
  };
  app.dynamodb = new AWS.DynamoDB(options);

  /**
   * Redis.
   */
  var redisHost = process.env.REDIS_PORT_6379_TCP_ADDR || config.redis.host;
  app.redis = redis.createClient(config.redis.port, redisHost);
  app.redis.on('error', err => {
    console.error('Redis error ' + err);
  });

};
