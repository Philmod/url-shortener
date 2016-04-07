const config = require('config');
const dynamodb = require('./dynamoHelper')();
const schema = require('../config/dynamoUrlsSchema');
schema.TableName = config.database.tableName;

dynamodb.listTables((err, data) => {
  if (err) console.error(err, err.stack);
  else {
    var tableExists = false;
    data.TableNames.forEach(table => {
      if (table == config.database.tableName) {
        tableExists = true;
      }
    });

    console.log('The table ' + config.database.tableName + ' already exists in DynamoDB');

    if (!tableExists) {
      console.log('Creating the table ' + config.database.tableName + ' in DynamoDB');
      dynamodb.createTable(schema, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
    }
  }
});
