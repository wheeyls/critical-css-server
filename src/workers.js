var BuildCss = require('./workers/BuildCss.js');
var redis = require('redis');
var generator = require('./generator.js');

module.exports = function (queue) {
  return {
    start: function () {
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
  }
};
