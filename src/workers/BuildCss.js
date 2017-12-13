// @format
var CachedCss = require('../models/CachedCss.js');
var bluebird = require('bluebird');

function BuildCss(generator, client) {
  this.perform = bluebird.promisify(function(data, done) {
    var pageData = data.page;
    var config = data.config;
    var item = new CachedCss(client, pageData);

    try {
      item.begin(function() {
        generator.generate(pageData.url, pageData.css, config, function(
          err,
          output
        ) {
          if (err) {
            item.del(function() {
              done(err);
            });
          } else {
            item.finish(output, done);
          }
        });
      });
    } catch (err) {
      item.del(function() {
        done(err);
      });
    }
  });
}

module.exports = BuildCss;
