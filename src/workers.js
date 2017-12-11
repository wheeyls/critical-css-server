// @format
var BuildCss = require('./workers/BuildCss.js');
var redis = require('redis');
var generator = require('./generator.js');

module.exports = function(queue) {
  return {
    start: function() {
      console.log('bull: worker started...');

      var redisClient = redis.createClient({url: process.env.REDIS_URL});
      var worker = new BuildCss(generator(), redisClient);

      queue.on('completed', function(job) {
        console.log('bull: completed: ', job.data.page.key);
      });

      queue.on('error', function(job) {
        console.log('bull: job error! ', job.data);
        throw arguments;
      });

      queue.on('failed', function(job) {
        console.log('bull: job failed! ', job.data);
        throw console.log(arguments[0], arguments[1], arguments[2]);
      });

      queue.process(function(job, done) {
        console.log('bull: process started...', job.data.page.key);

        return worker
          .perform(job.data)
          .then(function(data) {
            console.log('bull: process done', job.data.page.key);
            done(null, data);
          })
          .catch(function(err) {
            console.log('bull: process catch', job.data.page.key);
            done(err);
          });
      });
    },
  };
};
