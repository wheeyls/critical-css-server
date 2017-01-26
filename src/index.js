var Queue = require('bull');
var cluster = require('cluster');
var generator = require('./generator.js');
var queue = Queue('CriticalPath Generator', process.env.REDIS_URL);
var workerCount = 6;
var redis = require('redis');

g = generator();

function cssItem(client, params) {
  var me
    ;

  me = {
    whenNew: function (cb) {
      client.hgetall(params.key, function (err, value) {
        if (!value) { cb(err, value); }
      });
    },

    createStub: function (cb) {
      client.hset(params.key, 'status', 'waiting', function (err, value) {
        cb(err);
      });
    },

    finish: function (content, cb) {
      client.hset(params.key, 'status', 'done');
      client.hset(params.key, 'content', content, cb);
    },

    toJSON: function () {
      return params;
    }
  };

  return me;
}

function manageQueue() {
  var subClient = redis.createClient({ url: process.env.REDIS_URL }),
      client = subClient.duplicate();

  console.log('master started...');

  subClient.on('message', function (_topic, params) {
    params = JSON.parse(params);
    var item = cssItem(client, params);

    item.whenNew(function (err) {
      if (err) { throw err; }

      item.createStub(function (err) {
        if (err) { throw err; }

        queue.add(item.toJSON());
        console.log('added...');
      });
    });
  });

  subClient.subscribe('critical-css:not-found');
}

function processItems() {
  var redisClient = redis.createClient({ url: process.env.REDIS_URL });
  console.log('worker started...');

  queue.on('completed', function (job, result) {
    console.log('completed...');
  });

  queue.process(function (job, done) {
    var item = cssItem(redisClient, job.data);
    console.log('started...');
    g.generate(job.data.url, job.data.css, function (err, output) {
      if (err) {
        done(err);
      } else {
        item.finish(output, done);
      }
    });
  });
}

if (cluster.isMaster) {
  for (var i = 0, ii = workerCount; i < ii; i += 1) { cluster.fork(); }

  manageQueue()
} else {
  processItems()
}
