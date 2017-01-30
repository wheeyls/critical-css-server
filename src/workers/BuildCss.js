var CachedCss = require('../models/CachedCss.js');

function BuildCss(generator, client) {
  this.perform = function (data, done) {
    var item = new CachedCss(client, data);

    generator.generate(data.url, data.css, function (err, output) {
      if (err) {
        done(err);
      } else {
        item.finish(output, done);
      }
    });
  };
}

module.exports = BuildCss;
