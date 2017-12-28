
var BuildCss = require('../workers/BuildCss.js');
var redis = require('redis');
var generator = require('../generator.js');

var redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on('error', function (err) { console.error(err) });
var worker = new BuildCss(generator(), redisClient);


module.exports = function (job, done) {
  console.log('bull: process started...', job.data.page.key);
    return worker
      .perform(job.data)
      .then(function (data) {
        console.log('bull: process done', job.data.page.key);
        done(null, data);
      })
      .catch(function (err) {
        console.error('bull: process catch', job.data.page.key);
        done(err);
      });
};
