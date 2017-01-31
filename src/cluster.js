var bull = require('bull');
var cluster = require('cluster');
var generator = require('./generator.js');
var queue = bull('CriticalPath Generator', process.env.REDIS_URL);
var workerCount = 1;
var redis = require('redis');
var BuildCss = require('./workers/BuildCss.js');

function processItems() {
  console.log('worker started...');

  var redisClient = redis.createClient({ url: process.env.REDIS_URL });
  var worker = new BuildCss(generator(), redisClient);

  queue.on('completed', function (job) {
    console.log('completed: ', job.data.key);
  });

  queue.process(function (job, done) {
    console.log('started...', job.data.key);

    worker.perform(job.data, done);
  });
}

if (cluster.isMaster) {
  for (var i = 0, ii = workerCount - 1; i < ii; i += 1) { cluster.fork(); }
  processItems();
} else {
  processItems();
}
