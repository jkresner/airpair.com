var express = require('express');
var app = express();
var livereload = require('connect-livereload');

app.use(livereload({ port: 35729 }));

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/dist'));

var server = app.listen(3333, function() {
  console.log('Listening on port %d', server.address().port);
});