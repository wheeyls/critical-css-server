var CachedCss = require('../models/CachedCss.js');

function QueueBuildRequests(client, queue) {
  this.perform = function (data) {
    var item = new CachedCss(client, data);

    item.load().then(function (err, attributes) {
      if (err) { throw err; }
      if (attributes.status !== 'new') { return; }

      item.createStub(function (err) {
        if (err) { throw err; }

        queue.add(item.toJSON());
        console.log('added...');
      });
    });
  };
}

module.exports = QueueBuildRequests;
