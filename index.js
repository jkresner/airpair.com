import globals from './server/global'
import routes from './server/routes/index'
import hbsEngine from './server/hbsEngine'
import * as mongoInit from './server/mongoInit'

export function run(appdir)
{
	var express = require('express')
	var app = express()
	app.dir = appdir

	mongoInit.setSessionStore(mongoInit.connect())

	if (config.local) {
		app.use(require('connect-livereload')({ port: 35729 }))
	}
	
	app.use(express.static(app.dir + '/public'))

	hbsEngine(app)
	routes(app)

	app.use(function(err, req, res, next){
	  console.error(err.stack)
	  res.send(500, 'Something broke!')
	})

	var server = app.listen(process.env.PORT || 3333, function() {
	  console.log('Listening on port %d', server.address().port)
	})

}