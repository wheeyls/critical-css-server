var Queue = require('bull');
var cluster = require('cluster');
var generator = require('./generator.js');
var queue = Queue('CriticalPath Generator', 6379, 'localhost');
var workerCount = 6;
var redis = require('redis');

g = generator();
redisClient = redis.createClient({ url: process.env.REDIS_URL });

queue.process(function (job, done) {
  console.log('started...');
  g.generate(job.data.url, job.data.css, function (err, output) {
    if (err) {
      done(err);
    } else {
      done(null, output);
    }
  });
});

if (cluster.isMaster) {
  queue.add({ url: 'http://localhost:3000', css: 'http://localhost:3000/assets/manifest_assets.css' }).then(function (e, o) {
    console.log(o);
  });
  console.log('queued...');

  setTimeout(function () {
    queue.add({ url: 'http://localhost:3000', css: 'http://localhost:3000/assets/manifest_assets.css' }).then(function (e, o) {
      console.log(o);
    });
    console.log('queued...');
  }, 1000);
} else {
  queue.on('completed', function (job, result) {
    console.log('completed...');
    // console.log(result);
  });
}
