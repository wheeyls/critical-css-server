var bull = require('bull');
var cluster = require('cluster');
var generator = require('./generator.js');
var queue = bull('CriticalPath Generator', process.env.REDIS_URL);
var workerCount = 1;
var redis = require('redis');
var BuildCss = require('./workers/BuildCss.js');
var QueueBuildRequests = require('./workers/QueueBuildRequests.js');
var RequestEmitter = require('./RequestEmitter.js');

function manageQueue() {
  var subClient = redis.createClient({ url: process.env.EXTERNAL_REDIS_URL }),
      worker = new QueueBuildRequests(subClient.duplicate(), queue),
      requests = new RequestEmitter(subClient);

  requests.on('request', function (params) { worker.perform(params); });
}

function processItems() {
  console.log('worker started...');

  var redisClient = redis.createClient({ url: process.env.EXTERNAL_REDIS_URL });
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
  for (var i = 0, ii = workerCount; i < ii; i += 1) { cluster.fork(); }
  manageQueue();
} else {
  processItems();
}
