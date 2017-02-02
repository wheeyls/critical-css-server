var app = require('./app.js')();
var matador = require('./bull-ui.js');

app.use('/matador/', function(req, res, next){
  req.basepath = '/matador';
  res.locals.basepath = '/matador';
  next();
}, matador);

app.listen(process.env.PORT, function () {
  console.log('Listening on port:', this.address().port);
});
