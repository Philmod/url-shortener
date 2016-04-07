const config = require('config');
const dynamodb = require('./dynamoHelper')();

const params = {
  TableName: config.database.tableName
};

dynamodb.deleteTable(params, function(err, data) {
  if (err) console.log(err, err.stack);
  else console.log(data);
});
