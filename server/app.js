function run({config,MAServer,tracking}, done) {

  config.about = _.omit(config.about,'scripts','engines','dependencies','devDependencies','private','license')
  config.routes.redirects.on = true
  config.routes.rss = { on: true }
  // console.log('config', _.omit(config,'wrappers','auth','logic'))

  var app               = MAServer.App(config, done)
  var analytics         = MAServer.Analytics(config, tracking)
  var Auth              = require('meanair-auth')
  var model             = require(`meanair-model`)(done)

  model.connect(() => {

    global.DAL = model.DAL
    global.cache = model.cache
    require('./util/cache')

    global.analytics    = analytics.connect(DAL)

    global.API          = require('./api/_all')
    global.util         = require('../shared/util')
    _.wrapFnList        = util.wrapFnList

    global.Wrappers     = require('./services/wrappers/_index')
    global.mailman      = require('./util/mailman')()
    global.pairbot      = require('./util/pairbot')()
    global.svc = { newTouch(action) { return { action, _id: DAL.User.newId(),
      utc: new Date(), by: { _id: this.user._id, name: this.user.name } } } }


    cache.get('redirects',

      cb => config.routes.redirects ? DAL.Redirect.getAll(cb) : cb(null,[]),

      () => app.meanair.set(model, {analytics})
                       .merge(Auth)
                       .chain(config.middleware, config.routes)
                       .run()
    )

  })

  return app
}


module.exports = { run }
