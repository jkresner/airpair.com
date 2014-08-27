var express = require('express');
var app = express();


app.get('/hello.txt', function(req, res){
  res.send('Hello Uri Worldly');
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app'));

var server = app.listen(3333, function() {
    console.log('Listening on port %d', server.address().port);
});