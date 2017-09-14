// @format
var expect = require('expect.js');
var generator = require('../src/generator.js')();

describe('#generate', function() {
  describe('with no url', function() {
    it('returns an error', function() {
      generator
        .generate('http://example.com', 'aaa', function() {})
        .catch(function(e) {
          expect(e).to.be.a(Error);
        });
    });
  });
});
