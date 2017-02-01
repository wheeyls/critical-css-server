var request = require('supertest');
var prepareApp = require('../src/app.js');
var expect = require('expect.js');
var CachedCss = require('../src/models/CachedCss.js');
var redis = require('redis-mock');
var simple = require('simple-mock');

describe('app.js', function () {
  describe('POST /api/v1/css', function () {
    before(function () {
      this.client = redis.createClient();
      this.app = prepareApp({ redis: this.client, queue: { add: simple.stub() } });
    });

    describe('with valid params', function () {
      var params = { page: { key: 1, url: '/path', css: '/css' } };

      describe('asking for item that is ready', function () {
        before(function (done) {
          this.cached = new CachedCss(this.client, params.page);
          this.cached.finish('css {};', done);
        });

        it('should return a 200 and the content', function () {
          return request(this.app).post('/api/v1/css')
            .send(params)
            .set('Content-Type', 'application/json')
            .expect(200, 'css {};');
        });
      });

      describe('asking for item that is new', function () {
        var params = { page: { key: 2, url: '/path', css: '/css' } };

        it('should return a 202', function () {
          return request(this.app).post('/api/v1/css')
            .send(params)
            .set('Content-Type', 'application/json')
            .expect(202);
        });
      });

      describe('asking for item that is working', function () {
        var params = { page: { key: 'working', url: '/path', css: '/css' } };
        before(function (done) {
          this.cached = new CachedCss(this.client, params.page);
          this.cached.createStub(done);
        });

        it('should return a 202', function () {
          return request(this.app).post('/api/v1/css')
            .send(params)
            .set('Content-Type', 'application/json')
            .expect(202);
        });
      });

      describe('asking for item that is waiting', function () {
        var params = { page: { key: 'waiting', url: '/path', css: '/css' } };
        before(function (done) {
          this.cached = new CachedCss(this.client, params.page);
          this.cached.begin(done);
        });

        it('should return a 202', function () {
          return request(this.app).post('/api/v1/css')
            .send(params)
            .set('Content-Type', 'application/json')
            .expect(202);
        });
      });

      describe('asking for item that is failed', function () {
        var params = { page: { key: 'failed', url: '/path', css: '/css' } };
        before(function (done) {
          this.cached = new CachedCss(this.client, params.page);
          this.cached.failed(done);
        });

        it('should return a 202', function () {
          return request(this.app).post('/api/v1/css')
            .send(params)
            .set('Content-Type', 'application/json')
            .expect(202);
        });
      });
    });
  });
});
