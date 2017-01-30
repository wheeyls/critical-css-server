var expect = require('expect.js');
var redis = require('redis-mock');
var RequestEmitter = require('../src/RequestEmitter.js');

describe('RequestEmitter', function () {
  describe('#on("request")', function () {
    before(function () {
      this.client = redis.createClient();
      this.subject = new RequestEmitter(this.client);
    });

    it('is triggered when redis event comes in', function (done) {
      this.subject.on('request', function (data) {
        expect(data).to.eql({ data: 1 });
        done();
      });

      this.client.publish('critical-css:not-found', JSON.stringify({ data: 1 }));
    });

    it('fails when invalid JSON received', function (done) {
      this.subject.on('error', function (e, data) {
        expect(data).to.eql('{ x:');
        done();
      });

      this.client.publish('critical-css:not-found', '{ x:');
    });
  });
});
