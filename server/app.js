function run({config,MAServer,tracking}, done) {

  config.about = _.omit(config.about,'scripts','engines','dependencies','devDependencies','private','license')
  global.config = config

  var app               = MAServer.App(config, done)
  var analytics         = MAServer.Analytics(config, tracking)
  var Auth              = require('meanair-auth')
  var model             = require(`meanair-model`)(done)

  model.connect(() => {

    global.DAL = assign(model.DAL,{ENUM:model.Enum})
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

    cache.get('httpRules', API.Redirects.svc.getForCache, () =>

      app.meanair.set(model, {analytics})
                 .merge(Auth)
                 .chain(config.middleware, config.routes)
                 .run()

    )

  })

  return app
}


module.exports = { run }
