var port = process.env.BULL_UI_PORT || 8080;
var redisOpts = require('redis-url').parse(process.env.REDIS_URL);
var app = require('bull-ui/app')({ redis: {
  host: redisOpts.hostname,
  port: redisOpts.port,
  password: redisOpts.password,
  options: { database: redisOpts.database } }
});

app.listen(port, function() {
  console.log('bull-ui started listening on port', this.address().port);
});
