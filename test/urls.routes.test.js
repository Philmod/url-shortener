var app = require('../index');
var expect = require('chai').expect;
var request = require('supertest');
var models = app.set('models');

describe('urls.routes.test.js', () => {

  describe('GET /', () => {

    it('responds with a web page containing a form', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end((e, res) => {
          expect(e).to.not.exist;
          var page = res.text;
          expect(page).to.contain('form');
          expect(page).to.contain('action="/url"');
          expect(page).to.contain('method="post"');
          done();
        });
    });

  });

  describe('POST /url', () => {

    it('responds with a web page containing the shortened url', (done) => {
      request(app)
        .post('/url')
        .send({
          url: 'https://google.com'
        })
        .expect(200)
        .end((e, res) => {
          expect(e).to.not.exist;
          var page = res.text;
          expect(page).to.contain('http://localhost:3070/');
          done();
        });
    });

    describe('Same url', () => {

      var existingUrl = 'https://facebook.com';
      var existingId = 'a1b2c3';

      before(done => {
        models.Url.insert(existingUrl, existingId, done);
      });

      it('responds with the same short url if already shortened', (done) => {
        request(app)
          .post('/url')
          .send({
            url: existingUrl
          })
          .expect(200)
          .end((e, res) => {
            expect(e).to.not.exist;
            var page = res.text;
            expect(page).to.contain(existingId);
            done();
          });
      });

    });

  });

  describe('GET /:id', () => {

    var existingUrl = 'https://canary.is';
    var existingId = 'abcdef';

    before(done => {
      models.Url.insert(existingUrl, existingId, done);
    });

    it('responds with a 404 if id does not exist', (done) => {
      request(app)
        .get('/12345')
        .expect(404)
        .end((e, res) => {
          expect(e).to.not.exist;
          done();
        });
    });

    it('redirects if id exists', (done) => {
      request(app)
        .get('/' + existingId)
        .expect(302)
        .end((e, res) => {
          expect(e).to.not.exist;
          expect(res.text).to.contain('Redirecting to ' + existingUrl);
          done();
        });
    });

  });

});
