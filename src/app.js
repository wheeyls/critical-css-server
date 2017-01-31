var express = require('express');
var extend = require('extend');
var redis = require('redis');
var QueueBuildRequests = require('./workers/QueueBuildRequests.js');

var bull = require('bull');
var bodyParser = require('body-parser');

var defaults = {
  redis: redis.createClient({ url: process.env.REDIS_URL }),
  queue: bull('CriticalPath Generator', process.env.REDIS_URL)
};

function prepareApp(config) {
  var app = express();
  var options = extend(defaults, config);
  var worker = new QueueBuildRequests(options.redis, options.queue);

  app.use(bodyParser.json());

  app.post('/css', 
    function (req, res, next) {
      if (req.get('Content-Type') !== 'application/json') {
        res.sendStatus(406);
      } else {
        next();
      }
    },

    function (req, res) {
      worker.perform(req.body, function (error, item) {
        if (error) { res.status(500).send({ error: 'API Error' }); }

        if (item.attributes.content) {
          res.send(item.attributes.content);
        } else {
          res.status(202).send('Accepted');
        }
      });
    }
  );

  return app;
}

module.exports = prepareApp;
