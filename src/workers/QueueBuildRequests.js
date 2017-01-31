var CachedCss = require('../models/CachedCss.js');

function QueueBuildRequests(client, queue) {
  this.perform = function (data, done) {
    var item = new CachedCss(client, data);

    item.load().then(function (attributes) {
      if (attributes.status !== 'new') { return done(null, item); }

      item.createStub(function (err) {
        if (err) { return done(err); }

        queue.add(item.toJSON());
        console.log('added...');
        done(null, item);
      });
    }).catch(function (e) { done(e); });
  };
}

module.exports = QueueBuildRequests;
