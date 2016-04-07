const AWS = require('aws-sdk');
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

};
