module.exports = () => {
  const config = require('config');
  const AWS = require('aws-sdk');

  AWS.config.update(config.get('aws'));
  const dynamodb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') });

  return dynamodb;
}
