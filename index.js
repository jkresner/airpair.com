var express = require('express');
var handlebars = require('express-handlebars');
var app = express();
var livereload = require('connect-livereload');

app.engine('html', handlebars());
app.set('views', __dirname + '/app');

app.use(livereload({ port: 35729 }));

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/dist'));

app.get('/blog/mean-stack/90-days-of-airpairing-on-airpair', function(req,res,next){
	res.status(200).render('./blog/0827.html');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

var server = app.listen(3333, function() {
  console.log('Listening on port %d', server.address().port);
});