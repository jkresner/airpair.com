import globals from './server/global'
import routes from './server/routes/index'
import hbsEngine from './server/hbsEngine'
import * as mongo from './server/mongoInit'
import session from './server/identity/session'
require('colors')


// DO NOT MOVE ANYTHING IN THIS FILE
// middleware order is 112% crucial to not screw up sessions

export function run(appdir)
{
	var express = require('express')
	var app = express()
	app.dir = appdir
	
	//-- We don't want to serve sessions for static resources
	//-- Save database write on every resources
	app.use(express.static(app.dir+'/public'))

	mongo.connect()
	session(app, mongo.initSessionStore)

	//-- Do not move connect-livereload before session middleware
	if (config.local) {
		app.use(require('connect-livereload')({ port: 35729 }))
	}
	
	hbsEngine(app)
	routes(app)

	app.use(function(err, req, res, next){
	  console.log(err.stack.red)
	  res.status(400).send('Something broke!<br /><br />'+err.message)
	})

	var server = app.listen(process.env.PORT || 3333, function() {
	  console.log('Listening on port %d', server.address().port)
	})

}