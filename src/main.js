// @format
var cluster = require('cluster');
var workerCount = process.env.CONCURRENCY || 1;
var app = require('./app.js')();
var queue = require('./generatorQueue.js');
var workers = require('./workers.js')(queue);
var port = process.env.PORT || 5001;

if (cluster.isMaster) {
  setInterval(function() {
    queue.clean(1000 * 60 * 60);
  }, 60000);

  app.listen(port, function() {
    console.log('Listening on port:', this.address().port);
  });

  for (var i = 0, ii = workerCount; i < ii; i += 1) {
    var clusterWorker = cluster.fork();
    clusterWorker.on('exit', function(code, signal) {
      if (signal) {
        console.log(`worker was killed by signal: ${signal}`);
      } else if (code !== 0) {
        console.error(`worker exited with error code: ${code}`);
      } else {
        console.log('worker success!');
      }
    });

    clusterWorker.on('error', function(err) { console.error(err) });
  }
} else {
  workers.start();
}
