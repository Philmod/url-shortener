var app = require('../index');
var expect = require('chai').expect;
var request = require('supertest');
var models = app.set('models');
const utils = require('../test/utils.js');

describe('admin.routes.test.js', () => {

  before(done => {
    utils.cleanAllUrlsTable(done);
  });

  describe('GET /login', () => {

    it('responds with a web page containing a form', (done) => {
      request(app)
        .get('/login')
        .expect(200)
        .end((e, res) => {
          expect(e).to.not.exist;
          var page = res.text;
          expect(page).to.contain('form');
          expect(page).to.contain('action="/login"');
          expect(page).to.contain('method="post"');
          done();
        });
    });

  });

  describe('POST /login', () => {

    it('responds with an error if bad username or password', (done) => {
      request(app)
        .post('/login')
        .send({
          username: 'badguy',
          password: 'password'
        })
        .expect(401)
        .end((e, res) => {
          expect(e).to.not.exist;
          done();
        });
    });

    it('redirects to /admin if good credentials', (done) => {
      request(app)
        .post('/login')
        .send({
          username: 'admin',
          password: 'password'
        })
        .expect(302)
        .end((e, res) => {
          expect(e).to.not.exist;
          expect(res.text).to.contain('Redirecting to /admin');
          done();
        });
    });

  });

  describe('GET /admin', () => {

    var existingUrl = 'https://lalibre.be';
    var existingId = 'ghijkl';

    before(done => {
      models.Url.insert(existingUrl, existingId, done);
    });

    it('redirects to login if not logged in', (done) => {
      request(app)
        .get('/admin')
        .expect(302)
        .end((e, res) => {
          expect(e).to.not.exist;
          expect(res.text).to.contain('Redirecting to /login');
          done();
        });
    });

    describe('Logged in', () => {

      var agent = request.agent(app);

      before(done => {
        agent
          .post('/login')
          .send({
            username: 'admin',
            password: 'password'
          })
          .expect(302)
          .end(done);
      });

      it('responds with the list of existing urls if logged in', (done) => {
        agent
          .get('/admin')
          .expect(200)
          .end((e, res) => {
            expect(e).to.not.exist;
            expect(res.text).to.contain('table');
            expect(res.text).to.contain(existingId);
            expect(res.text).to.contain(existingUrl);
            done();
          });
      });

    });

  });

});
