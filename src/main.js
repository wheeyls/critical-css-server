require('newrelic');

var bull = require('bull');
var cluster = require('cluster');
var generator = require('./generator.js');
var queue = bull('CriticalPath Generator', process.env.REDIS_URL);
var workerCount = process.env.CONCURRENCY || 1;
var redis = require('redis');
var BuildCss = require('./workers/BuildCss.js');
var CachedCss = require('./models/CachedCss.js');
var app = require('./app.js')();
var matador = require('./bull-ui.js');

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
  setInterval(function () { queue.clean(1000 * 60 * 60); }, 60000);

  app.use('/matador/', function(req, res, next){
    req.basepath = '/matador';
    res.locals.basepath = '/matador';
    next();
  }, matador);

  app.listen(process.env.PORT, function () {
    console.log('Listening on port:', this.address().port);
  });

  for (var i = 0, ii = workerCount; i < ii; i += 1) { cluster.fork(); }
} else {
  processItems();
}
