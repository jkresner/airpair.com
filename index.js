import globals from './global';
import routes from './routes';
import hbsEngine from './hbsEngine'

export function run(appdir)
{
	var livereload = require('connect-livereload');
	var express = require('express');
	var app = express();

	app.dir = appdir;

	if (livereload) {
		app.use(livereload({ port: 35729 }));
	}
	
	app.use(express.static(app.dir + '/app'));
	app.use(express.static(app.dir + '/public'));

	hbsEngine(app);
	routes(app);

	app.use(function(err, req, res, next){
	  console.error(err.stack);
	  res.send(500, 'Something broke!');
	});

	var server = app.listen(process.env.PORT || 3333, function() {
	  console.log('Listening on port %d', server.address().port);
	});

}