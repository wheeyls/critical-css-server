var url = process.env.REDIS_URL || 'redis://127.0.0.1/'
var redisOpts = require('redis-url').parse(url);

module.exports = {
  host: redisOpts.hostname,
  port: redisOpts.port,
  password: redisOpts.password,
  options: { db: redisOpts.database }
};
