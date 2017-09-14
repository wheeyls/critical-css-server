// @format
var bull = require('bull');
var queue = bull('CriticalPath Generator', process.env.REDIS_URL);

module.exports = queue;
