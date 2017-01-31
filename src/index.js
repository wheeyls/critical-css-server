var app = require('./app.js');

app().listen(process.env.PORT, function () {
  console.log('Listening on port:', process.env.PORT);
});
