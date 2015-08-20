// $timelapsed("APP READ")
var start       = new Date().getTime()
var mw          = require('./server/middleware/_middleware')
var session     = require('./server/identity/session')
var routes      = require('./server/routes/index')
require('./server/util/cache')

// DO NOT MOVE ANYTHING IN THIS FILE
// middleware order is 112% crucial to not screw up sessions

export function run(cb)
{
  $timelapsed("APP START")
  $log(`APP v${config.build.version}   Start   ${start}`.appload)

  var express = require('express')
  var app = express()

  app.use(mw.logging.badBot)
  app.use(routes('blackList'), (r,res) => res.status(404).send(''))
  routes('resolver')(app)

  //-- We don't want to serve sessions for static resources
  //-- Save database write on every resources
  app.use(express.static(config.http.appStaticDir, config.http.static))
  app.use(mw.logging.slowrequests)

  var mongo       = require('./server/util/mongoInit')
  mongo.connect(() => {
    $timelapsed("APP Connected")

    // Don't persist or track sessions for rss
    app.use('/rss', routes('rss')(app))

    app.use(mw.auth.setNonSessionUrl(app))

    session(app, mongo.initSessionStore, () => {

      $log(`           SessionStoreReady   ${new Date().getTime()-start}`.appload)

      app.use('/visit', routes('ads')(app))

      //-- Do not move connect-livereload before session middleware
      if (config.livereload) app.use(require('connect-livereload')({ port: 35729 }))

      var hbsEngine   = require('./server/views/_hbsEngine')
      hbsEngine(app)

      app.use(mw.logging.domainWrap)
      app.use(mw.data.cache.itemReady('tags'))

      app.get('/', mw.analytics.trackFirstRequest, mw.auth.authdRedirect('/dashboard'), app.renderHbs('home') )
      app.use('/auth', routes('auth')(app))
      app.use('/v1/api/matching', routes('api').matching)
      app.use('/v1/api/adm/bookings', routes('api').spinning)
      app.use('/v1/api/adm', routes('api').admin)
      app.use('/v1/api', routes('api').other)
      app.use('/v1/api/posts', routes('api').posts)
      // $timelapsed("APP ROUTES API")
      app.use(['^/matchmaking*','^/adm/bookings*'],
        mw.authz.plnr, app.renderHbsAdmin('adm/pipeliner'))

      app.use(['^/adm/pipeline','^/adm/request*','^/adm/users*','^/adm/orders*','^/adm/experts*','^/adm/companys*',
        '^/adm/views*','^/adm/posts*','^/adm/tags*','^/adm/chat*','^/adm/mail*','^/adm/redirects*'],
        mw.authz.adm, app.renderHbsAdmin('adm/admin'))

      app.use(mw.seo.noTrailingSlash) // Must be after root '/' route
      app.use(routes('redirects').addPatterns(app))

      app.use(mw.analytics.trackFirstRequest)
      routes('redirects').addRoutesFromDb(app, () => {

        app.use(routes('landing')(app))
        app.use(routes('dynamic')(app))
        app.get(routes('whiteList'), app.renderHbs('base') )

        app.use(mw.logging.pageNotFound)
        app.use(mw.logging.errorHandler(app))

        app.listen(config.port, () => {
          $log(`           Listening after ${new Date().getTime()-start}ms on port ${config.port}`.appload)
          if (cb) cb()
        })
      })
    })
  })

  return app;
}
