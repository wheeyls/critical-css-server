var port = process.env.BULL_UI_PORT || 8080;
var app = require('bull-ui/app')({ redis: { url: process.env.REDIS_URL } });

app.listen(port, function() {
  console.log('bull-ui started listening on port', this.address().port);
});
