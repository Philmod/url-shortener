module.exports = () => {
  const config = require('config');
  const AWS = require('aws-sdk');

  AWS.config.update(config.get('aws'));
  var dynamoAddr = process.env.DYNAMODB_PORT_8000_TCP_ADDR;
  var options = {
    endpoint: (dynamoAddr) ? ['http://', dynamoAddr, ':8000'].join('') : config.database.endpoint
  };
  const dynamodb = new AWS.DynamoDB(options);

  return dynamodb;
}
