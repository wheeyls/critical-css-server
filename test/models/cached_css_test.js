// @format
var expect = require('expect.js');
var CachedCss = require('../../src/models/CachedCss.js');
var redis = require('redis-mock');

describe('CachedCss', function() {
  before(function() {
    this.client = redis.createClient();
    this.subject = new CachedCss(this.client, {
      key: 'unique',
      url: '/path',
      css: '/css',
    });
  });

  describe('#load', function() {
    describe('with no existing record', function(done) {
      it('returns undefined', function() {
        return this.subject.load().then(function(attributes) {
          expect(attributes.status).to.be('new');
        });
      });
    });

    describe('with existing record', function(done) {
      before(function(done) {
        this.subject.createStub(done);
      });

      it('returns list of attributes', function() {
        return this.subject.load().then(function(attributes) {
          expect(attributes.status).to.eql('waiting');
        });
      });
    });
  });

  describe('#save', function() {
    it('writes attributes to redis', function(done) {
      var that = this;

      this.subject.save({x: 1}, function() {
        expect(that.subject.attributes.x).to.eql(1);
        done();
      });
    });
  });

  describe('#createStub', function() {
    it('sets status to waiting', function(done) {
      var that = this;

      this.subject.createStub(function() {
        expect(that.subject.attributes.status).to.eql('waiting');
        done();
      });
    });
  });

  describe('#finish', function() {
    it('sets status to done', function(done) {
      var that = this;
      that.subject.finish('content', function() {
        expect(that.subject.attributes.status).to.eql('done');
        done();
      });
    });

    it('writes content', function(done) {
      var that = this;
      that.subject.finish('content', function() {
        expect(that.subject.attributes.content).to.eql('content');
        done();
      });
    });
  });
});
