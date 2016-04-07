const dynamo = require('../app/lib/dynamo');
const expect = require('chai').expect;

var jsObject = {
  date: 'Wed Apr 06 2016 23:09:32 GMT-0400 (EDT)',
  id: '2686d1',
  viewCount: 0,
  shortUrl: 'http://localhost:3070/2686d1',
  fullUrl: 'https://medium.com/@Philmod/load-balancing-websockets-on-ec2-1da94584a5e9#.awz44jehb'
};

var dynamoDoc = {
  date: { S: 'Wed Apr 06 2016 23:09:32 GMT-0400 (EDT)' },
  id: { S: '2686d1' },
  viewCount: { N: '0' },
  shortUrl: { S: 'http://localhost:3070/2686d1' },
  fullUrl: { S: 'https://medium.com/@Philmod/load-balancing-websockets-on-ec2-1da94584a5e9#.awz44jehb' }
};

var dynamoModel = {
  date: 'S',
  id: 'S',
  viewCount: 'N',
  shortUrl: 'S',
  fullUrl: 'S'
};

describe('dynamo.lib.test.js', () => {

  describe('unwrapDocument', () => {

    it('successfully unwrap a document from dynamo into a js object', () => {
      var obj = dynamo.unwrapDocument(dynamoDoc);
      expect(obj).to.deep.equal(jsObject);
    });

  });

  describe('wrapObject', () => {

    it('successfully wrap an js object into a dynamo document', () => {
      var doc = dynamo.wrapObject(jsObject, dynamoModel);
      expect(doc).to.deep.equal(dynamoDoc);
    });

  });

});
