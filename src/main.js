// @format
var cluster = require('cluster');
var workerCount = process.env.CONCURRENCY || 1;
var app = require('./app.js')();
var queue = require('./generatorQueue.js');
var workers = require('./workers.js')(queue);

if (cluster.isMaster) {
  setInterval(function() {
    queue.clean(1000 * 60 * 60);
  }, 60000);

  app.listen(process.env.PORT, function() {
    console.log('Listening on port:', this.address().port);
  });

  for (var i = 0, ii = workerCount; i < ii; i += 1) {
    cluster.fork();
  }
} else {
  workers.start();
}
