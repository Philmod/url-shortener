const AWS = require('aws-sdk');
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

};
