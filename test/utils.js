const config = require('config');
const AWS = require('aws-sdk');
const async = require('async');

AWS.config.update(config.get('aws'));
const dynamodb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') }); // make sure we are using a local database

const tableName = config.database.tableName;
const params = {
  TableName: tableName
};
const tableSchema = require('../config/dynamoUrlsSchema')
tableSchema.TableName = tableName;

module.exports = {

  cleanAllUrlsTable: (done) => {
    async.auto({
      deleteTable: callback => {
        dynamodb.deleteTable(params, err => {
          callback(); // That's ok if the table doesn't exist yet.
        });
      },
      createTable: ['deleteTable', callback => {
        dynamodb.createTable(tableSchema, callback);
      }]
    }, done);
  }

}
