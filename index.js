import globals from './global';
import routes from './routes';
import hbsEngine from './hbsEngine'
import chat from './chat';

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
	chat(app);

	// Temporary route definition here for development purposes
	app.get('/', (req,res) => res.status(200).render('index.hbs') );

  // boilerplate error handling
	app.use(function(err, req, res, next){
	  console.error(err.stack);
	  res.send(500, `<pre>${err.stack}</pre>`);
	});

	var server = app.listen(process.env.PORT || 3333, function() {
	  console.log('Listening on port %d', server.address().port);
	});

}
