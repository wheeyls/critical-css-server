var bull = require('bull');
var cluster = require('cluster');
var generator = require('./generator.js');
var queue = bull('CriticalPath Generator', process.env.REDIS_URL);
var workerCount = process.env.CONCURRENCY || 1;
var redis = require('redis');
var BuildCss = require('./workers/BuildCss.js');
var CachedCss = require('./models/CachedCss.js');

function processItems() {
  console.log('worker started...');

  var redisClient = redis.createClient({ url: process.env.REDIS_URL });
  var worker = new BuildCss(generator(), redisClient);

  queue.on('completed', function (job) {
    console.log('completed: ', job.data.page.key);
  });

  queue.on('error', function (job) {
    console.log('job failed! ', job.data);
  });

  queue.process(function (job, done) {
    console.log('started...', job.data.page.key);

    worker.perform(job.data, done);
  });
}

if (cluster.isMaster) {
  for (var i = 0, ii = workerCount - 1; i < ii; i += 1) { cluster.fork(); }
  setInterval(function () { queue.clean(1000 * 60 * 60); }, 60000);

  processItems();
} else {
  processItems();
}
