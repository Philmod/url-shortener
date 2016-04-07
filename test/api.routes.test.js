const app = require('../index');
const expect = require('chai').expect;
const request = require('supertest');
const async = require('async');
const models = app.set('models');
const utils = require('../test/utils.js');

const url = 'http://www.superlongdomain.com/plus/a/really/long/path?my=shortner';
const id = 'abcde';

describe('api.routes.test.js', () => {

  beforeEach(done => {
    utils.cleanAllUrlsTable(done);
  });

  describe('POST /api/urls', () => {

    it('successfully shorten an url', (done) => {
      request(app)
        .post('/api/urls')
        .send({
          url: url
        })
        .expect(200)
        .end((e, res) => {
          expect(e).to.not.exist;
          var shortUrl = res.text;
          expect(shortUrl).to.contain('http://localhost:3070/');
          done();
        });
    });

  });

  describe('GET /api/urls/:id', () => {

    beforeEach(done => {
      models.Url.insert(url, id, done);
    });

    it('responds with a 404 if id does not exist', (done) => {
      request(app)
        .get('/api/urls/superid')
        .expect(404)
        .end((e, res) => {
          expect(e).to.not.exist;
          done();
        });
    });

    it('responds with one url object', (done) => {
      request(app)
        .get('/api/urls/' + id)
        .expect(200)
        .end((e, res) => {
          expect(e).to.not.exist;
          var obj = res.body;
          expect(obj).to.have.property('id', id);
          expect(obj).to.have.property('fullUrl', url);
          done();
        });
    });

  });

  describe('GET /api/urls', () => {

    var urls = ['url1', 'url2'];

    beforeEach(done => {
      async.each(urls, (item, callback) => {
        models.Url.insert(item, item, callback);
      }, done);
    });

    it('responds with all the url objects', (done) => {
      request(app)
        .get('/api/urls')
        .expect(200)
        .end((e, res) => {
          expect(e).to.not.exist;
          const data = res.body;
          expect(data.length).to.equal(urls.length);
          done();
        });
    });

  });

});
