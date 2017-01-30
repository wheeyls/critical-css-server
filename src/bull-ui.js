var app = require('bull-ui/app')({ redis: { url: process.env.REDIS_URL } });

app.listen(1337, function(){
  console.log('bull-ui started listening on port', this.address().port);
});
