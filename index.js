require('colors')
import mw from './server/middleware/_middleware'
import mongo from './server/util/mongoInit'
import session from './server/identity/session'
import hbsEngine from './server/views/_hbsEngine'
import routes from './server/routes/index'
require('./server/util/cache')
var start = new Date().getTime()


// DO NOT MOVE ANYTHING IN THIS FILE
// middleware order is 112% crucial to not screw up sessions

export function run()
{
  $log(`APP       Start   ${new Date().getTime()}`.white)

  var express = require('express')
  var app = express()

  //-- We don't want to serve sessions for static resources
  //-- Save database write on every resources
  app.use(express.static(config.appdir+'/dist'))
  app.use(express.static(config.appdir+'/public'))

  app.use(mw.logging.slowrequests)

  mongo.connect(() => {

    // Don't persist or track sessions for rss
    app.use('/rss', routes.rss(app))

    session(app, mongo.initSessionStore)

    //-- Do not move connect-livereload before session middleware
    if (config.livereload) app.use(require('connect-livereload')({ port: 35729 }))

    hbsEngine(app)

    app.get('/', mw.analytics.trackFirstRequest, mw.auth.authdRedirect('/dashboard'), app.renderHbs('home') )
    app.use('/auth', routes.auth(app))
    app.use('/v1/api', routes.api(app))
    app.use('/v1/adm/*', mw.authz.adm, app.renderHbsAdmin('adm/admin'))
    app.use('/adm/*', mw.authz.adm, app.renderHbsAdmin('adm/admin'))
    app.use('/matchmaking*', mw.authz.adm, app.renderHbsAdmin('adm/admin'))

    app.use(mw.seo.noTrailingSlash) // Must be after root '/' route
    app.use(mw.analytics.trackFirstRequest)

    routes.redirects.init(app, () => {
      app.use(routes.dynamic(app))
      app.get(routes.whiteList, app.renderHbs('base') )

      app.use( (err, req, res, next) => {
        // if (config.env != 'test') {
        $log('Express handler exception'.magenta)
        $error(err, req.user, req)
        //}
        res.status(err.status || 400)
        if (err.fromApi) res.json({error:err.message})
        else app.renderErrorPage(err)(req,res)
      })

      process.on('uncaughtException', (err) => {
        $log('uncaughtException'.red)
        $error(err, {name:'uncaught',_id:'',email:''}, null)
        process.exit(1)
      })

      var server = app.listen(config.port, function() {
        $log(`          Listening after ${new Date().getTime()-start}ms on port ${server.address().port}`.white)
      })
    })
  })

  return app;
}
