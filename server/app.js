function run(config, {MAServer,tracking,done}) {
  global.config         = config

  var start             = new Date().getTime()
  var app               = MAServer.App(config, done)

  var model             = require(`meanair-model`)(done)
  model.connect(() => {

    global.DAL = model.DAL
    global.cache = model.cache
    require('./util/cache')

    global.mailman = require('./util/mailman')()
    global.pairbot = require('./util/im/pairbot')()

    // var mw          = require('./middleware/_middleware')
    var routes      = require('./routes/index')


    global.svc = {
      newTouch(action) { return { action, _id: DAL.User.newId(),
          utc: new Date(), by: { _id: this.user._id, name: this.user.name } } }
    }

    var map = app.meanair.lib({passport:require('passport')})
               .set(model, {analytics:MAServer.Analytics(config, tracking)})
    //            .merge(require('meanair-auth'))
               .chain({api:false,session:false,plugins:false})


    var mw = app.meanair.middleware


    app.use(mw.$.cachedTags)
    app.use(mw.$.cachedTemplates)

    // routes('resolver')(app)

    app.use('/rss', routes('rss')(app, mw))
    // app.use(mw.auth.setNonSessionUrl(app))

    var session     = require('./util/session')
    session(app, (sessionMW, cb) => cb(model.sessionStore(sessionMW)))

    routes('ads')(app, mw)

    // app.use(mw.auth.showAuthdPageViews())

    routes('auth')(app, mw)
    routes('api')(app, mw)

    app.use(mw.$.badBot)


    // app.use(routes('redirects').addPatterns(app))

    // routes('redirects').addRoutesFromDb(app, () => {
      routes('dynamic')(app, mw)
      routes('pages')(app, mw)
      // app.get(routes('whiteList'), app.renderHbs('base') )

    map.run()

    // })
  })

  return app;
}


// app.use(routes('blackList'), (r,res) => res.status(404).send(''))


module.exports = { run }
