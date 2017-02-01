var CachedCss = require('../models/CachedCss.js');

function BuildCss(generator, client) {
  this.perform = function (data, done) {
    var pageData = data.page;
    var config = data.config;
    var item = new CachedCss(client, pageData);

    generator.generate(pageData.url, pageData.css, config, function (err, output) {
      if (err) {
        done(err);
      } else {
        item.finish(output, done);
      }
    });
  };
}

module.exports = BuildCss;
