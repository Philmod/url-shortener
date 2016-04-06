var app = require('../index');
var expect = require('chai').expect;
var request = require('supertest');

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

});
