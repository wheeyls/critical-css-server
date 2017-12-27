// @format
var path = require('path');

module.exports = function(queue) {
  return {
    start: function() {
      console.log('bull: worker started...');



      queue.on('completed', function(job) {
        console.log('bull: completed: ', job.data.page.key);
      });

      queue.on('error', function(job) {
        console.log('bull: job error! ', job);
      });

      queue.on('stalled', function(job) {
        console.log('bull: job stalled', job);
      })

      queue.on('exit', function(worker, code, signal) {
        console.log('bull: worker died', worker, code, signal);
      });

      queue.on('failed', function(job) {
        console.log('bull: job failed! ', job);
      });

      queue.process(path.join(process.cwd(),'src', 'processors', 'cssProcessor.js'));
    },
  };
};
