function run(config, {MAServer,tracking,done}) {

  // $timelapsed("APP START")
  // $log(`APP v${config.build.version}   Start   ${start}`.appload)

  var start       = new Date().getTime()

  var app         = MAServer.App(config, done)

  //-- We don't want to serve sessions for static resources
  //-- Save database write on every resources
  // for (var dir of config.http.static.dirs) {
    // console.log('static.dir'.white, dir)
    // app.use(express.static(dir, config.http.static))
  // }
  // app.use(express.static(config.http.static.dirs[0], config.http.static))
  // app.use(mw.logging.slowrequests)

  // global.$logIt = function() {
  //   var args = [].slice.call(arguments)
  //   if (args[0].match(/modl/i) != null) return
  //   args[0] = args[0].white
  //   console.log.apply(null,args)
  // }

  var model = require(`meanair-model`)(done)
  model.connect(() => {

    global.DAL = model.DAL
    // $timelapsed("DAL Connected", DAL)
    var mw          = require('./middleware/_middleware')
    var session     = require('./util/session')
    var routes      = require('./routes/index')
    require('./util/cache')
    app.use(mw.logging.badBot)
    app.use(routes('blackList'), (r,res) => res.status(404).send(''))
    routes('resolver')(app)

    app.meanair.lib({passport:require('passport')})
               .set(model, {analytics:MAServer.Analytics(config, tracking)})
    //            .merge(require('meanair-auth'))
               .chain({api:false,session:false,plugins:false})
    //            .run()


    global.wrapAnalytics()

    global.svc = {
      newTouch(action) { return { action, _id: DAL.User.newId(),
          utc: new Date(), by: { _id: this.user._id, name: this.user.name } } }
    }

    app.use('/rss', routes('rss')(app))

    app.use(mw.auth.setNonSessionUrl(app))

    session(app, (sessionMW, cb) => cb(model.sessionStore(sessionMW)))

    $log(`           SessionStoreReady   ${new Date().getTime()-start}`.appload)


    app.use('/visit', routes('ads')(app))


    var hbsEngine   = require('./views/_hbsEngine')
    hbsEngine(app)

    app.use(mw.logging.domainWrap)
    app.use(mw.data.cache.itemReady('tags'))
    app.use(mw.auth.showAuthdPageViews())

    mailman.init()
    pairbot.init()

    app.get('/', mw.analytics.trackFirstRequest, mw.auth.authdRedirect('/dashboard'), app.renderHbs('home') )

    routes('auth')(app)

    app.use('/v1/api/matching', routes('api').matching)
    app.use('/v1/api/adm/bookings', routes('api').spinning)
    app.use('/v1/api/adm', routes('api').admin)
    app.use('/v1/api', routes('api').other)
    app.use('/v1/api/posts', routes('api').posts)
    $timelapsed("APP ROUTES API")
    app.use(['^/matchmaking*','^/adm/bookings*'],
      mw.authz.plnr, app.renderHbsAdmin('adm/pipeliner'))

    app.use(['^/adm/pipeline*','^/adm/request*','^/adm/users*','^/adm/orders*','^/adm/experts*','^/adm/posts*','^/adm/redirects*'],
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

      var cb = done || (e => {})
      app.listen(config.http.port, () => {
        // $log(`           Listening after ${new Date().getTime()-start}ms on port ${config.port}`.appload)
        cb()
      }).on('error', cb)
    })
  })

  return app;
}


module.exports = { run }
