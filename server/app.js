function run({config,MAServer,tracking}, done) {

  var app               = MAServer.App(config, done)
  var analytics         = MAServer.Analytics(config, tracking)

  var model             = require(`meanair-model`)(done)
  model.connect(() => {

    global.DAL = model.DAL
    global.cache = model.cache
    require('./util/cache')

    global.API            = require('./api/_all')
    global.util           = require('../shared/util')
    _.wrapFnList          = util.wrapFnList

    global.$callSvc       = (fn, ctx) =>
      function() {
        var thisCtx = { user: ctx.user, sessionID: ctx.sessionID, session: ctx.session }
        // $log('fn', fn, thisCtx, arguments)
        fn.apply(thisCtx, arguments)
      }

    global.Wrappers = require('./services/wrappers/_index')
    global.mailman = require('./util/mailman')()
    global.pairbot = require('./util/pairbot')()
    global.svc = { newTouch(action) { return { action, _id: DAL.User.newId(),
      utc: new Date(), by: { _id: this.user._id, name: this.user.name } } } }


    var mapp = app.meanair.lib({passport:require('passport')})
               .set(model, {analytics})
               .merge(require('meanair-auth'))


    // app.use(mw.auth.setNonSessionUrl(app))
    // app.use(mw.auth.showAuthdPageViews())


    var chain = (e, map) => {

      var restrict = req => req.ctx.bot||req.nonSessionUrl
      config.middleware.session.regulate = {restrict}
      config.routes.redirects = {map}

      mapp.chain(config.middleware, config.routes)
          .run()
    }

    if (config.routes.redirects.on)
      DAL.Redirect.getAll(chain)
    else
      chain(null, {})

  })


  return app
}


module.exports = { run }
