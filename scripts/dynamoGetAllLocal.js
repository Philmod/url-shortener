const config = require('config');
const dynamodb = require('./dynamoHelper')();

var params = {
    TableName : config.database.tableName
};

console.log("Scanning " + config.database.tableName + " table.");
dynamodb.scan(params, onScan);

function onScan(err, data) {
  if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    // Print the retrieved items.
    console.log("Scan succeeded.");
    data.Items.forEach(function(item) {
     console.log(item);
    });

    // Continue scanning if we have more movies
    if (typeof data.LastEvaluatedKey != "undefined") {
      console.log("Scanning for more...");
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      dynamodb.scan(params, onScan);
    }
  }
}
