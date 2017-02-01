var redisOpts = require('./redisOpts.js');
var bullUI = require('bull-ui/app')({ redis: redisOpts });

module.exports = bullUI;
