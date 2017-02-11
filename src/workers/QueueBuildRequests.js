var CachedCss = require('../models/CachedCss.js');
var bluebird = require('bluebird');

function QueueBuildRequests(client, queue) {
  this.perform = bluebird.promisify(function (data, done) {
    var item = new CachedCss(client, data.page);

    item.load().then(function (attributes) {
      if (['new', 'failed'].includes(attributes.status)) {
        item.createStub(function (err) {
          if (err) { return done(err); }

          queue.add({ page: item.toJSON(), config: data.config }, { attempts: 1 });
          console.log('added...');
          done(null, item);
        });
      } else {
        done(null, item);
      }
    }).catch(function (e) { done(e); });
  });
}

module.exports = QueueBuildRequests;
