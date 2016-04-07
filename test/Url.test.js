const app = require('../index');
const expect = require('chai').expect;
const request = require('supertest');
const async = require('async');
const models = app.set('models');
const utils = require('../test/utils.js');
const Url = models.Url;

const url = 'fullurl';
const id = 'id';

describe('Url.test.js', () => {

  beforeEach(done => {
    utils.cleanAllUrlsTable(done);
  });

  describe('insert', () => {

    it('responds a new url', (done) => {
      Url.insert(url, id, (err) => {
        expect(err).to.not.exist;
        Url.clearCache();
        Url.getById(id, (err, data) => {
          expect(err).to.not.exist;
          expect(data).to.have.property('fullUrl', url);
          done();
        });
      })
    });

  });

  describe('getById', () => {

    beforeEach(done => {
      Url.insert(url, id, done);
    });

    beforeEach(() => {
      Url.clearCache();
    });

    it('responds a new url', (done) => {
      Url.getById(id, (err, data) => {
        expect(err).to.not.exist;
        expect(data).to.have.property('id', id);
        expect(data).to.have.property('shortUrl');
        expect(data).to.have.property('fullUrl', url);
        expect(data).to.have.property('date');
        expect(data).to.have.property('viewCount', 0);
        done();
      })
    });

  });

  describe('getAll', () => {

    var urls = ['url1', 'url2'];

    beforeEach(done => {
      async.each(urls, (item, callback) => {
        Url.insert(item, item, callback);
      }, done);
    });

    beforeEach(() => {
      Url.clearCache();
    });

    it('responds a new url', (done) => {
      Url.getAll((err, data) => {
        expect(err).to.not.exist;
        expect(data.length).to.equal(urls.length);
        done();
      })
    });

  });

  describe('incrementView', () => {

    beforeEach(done => {
      Url.insert(url, id, done);
    });

    it('responds a new url', (done) => {
      Url.incrementView(id, 2, (err, data) => {
        expect(err).to.not.exist;
        Url.clearCache();
        Url.getById(id, (err, data) => {
          expect(err).to.not.exist;
          expect(data.viewCount).to.equal(2);
          done();
        });
      })
    });

  });

});
