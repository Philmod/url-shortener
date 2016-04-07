const config = require('config');
const dynamodb = require('./dynamoHelper')();
const schema = require('../config/dynamoUrlsSchema');
schema.TableName = config.database.tableName;

/**
 * Check if the table name exists in the list of tables.
 *
 * @param {String} tableName
 * @param {String} listTables
 * @return {Boolean}
 */
function doesTableExist(tableName, listTables) {
  var tableExists = false;
  listTables.forEach(table => {
    if (table == tableName) {
      tableExists = true;
    }
  });
  return tableExists;
}

dynamodb.listTables((err, data) => {
  if (err) console.error(err, err.stack);
  else {
    if (!doesTableExist(config.database.tableName, data.TableNames)) {
      console.log('Creating the table ' + config.database.tableName + ' in DynamoDB');
      dynamodb.createTable(schema, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
      });
    } else {
      console.log('The table ' + config.database.tableName + ' already exists in DynamoDB');
    }
  }
});
