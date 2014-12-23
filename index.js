import routes from './server/routes/index'
import hbsEngine from './server/hbsEngine'
import * as mongo from './server/mongoInit'
import session from './server/identity/session'
require('colors')
require('./server/util/cache')

// DO NOT MOVE ANYTHING IN THIS FILE
// middleware order is 112% crucial to not screw up sessions

export function run()
{
  var express = require('express')
  var app = express()

  //-- We don't want to serve sessions for static resources
  //-- Save database write on every resources
  app.use(express.static(config.appdir+'/dist'))
  app.use(express.static(config.appdir+'/public'))

  app.use(function(req, res, next){
    var start = new Date;
    res.on('finish', function(){
      var duration = new Date - start;
      if (duration > 1000)
      $log(`req::end ${duration} ${req.url}`.red)
    })
    next()
  })

  mongo.connect(() => {
    session(app, mongo.initSessionStore)

    //-- Do not move connect-livereload before session middleware
    if (config.livereload) app.use(require('connect-livereload')({ port: 35729 }))

    hbsEngine(app)
    routes(app, () => {
      app.use( (err, req, res, next) => {
        $error(err, req.user, req)
        res.status(400).send(err.message)
      })

      process.on('uncaughtException', (err) => {
        $error(err, {name:'uncaught',_id:'',email:''}, null)
        process.exit(1)
      })

      var server = app.listen(config.port, function() {
        console.log(`Listening on port ${server.address().port}`.white)
      })
    })
  })

  return app;
}
