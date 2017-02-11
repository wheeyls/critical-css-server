var CachedCss = require('../models/CachedCss.js');
var bluebird = require('bluebird');

function BuildCss(generator, client) {
  this.perform = bluebird.promisify(function (data, done) {
    var pageData = data.page;
    var config = data.config;
    var item = new CachedCss(client, pageData);

    item.begin(function () {
      generator.generate(pageData.url, pageData.css, config, function (err, output) {
        if (err) {
          item.del(function () { done(err); });
        } else {
          item.finish(output, done);
        }
      });
    });
  });
}

module.exports = BuildCss;
