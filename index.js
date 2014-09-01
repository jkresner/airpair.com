import {init} from './global';
import * as blog from './blog';

export function run(appdir)
{
	init();

	var livereload = require('connect-livereload');
	var express = require('express');
	var app = express();

	app.dir = appdir;

	app.use(livereload({ port: 35729 }));

	app.use(express.static(app.dir + '/app'));
	app.use(express.static(app.dir + '/public'));

	app.set('views', app.dir + '/app');
	blog.blogInit(app);

	app.use(function(err, req, res, next){
	  console.error(err.stack);
	  res.send(500, 'Something broke!');
	});

	var server = app.listen(process.env.PORT || 3333, function() {
	  console.log('Listening on port %d', server.address().port);
	});

}