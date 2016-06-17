function run({config, MAServer,tracking}, done) {

  global.config = config

  var formatter         = require('./app.track.formatter')
  var analytics         = MAServer.Analytics(config, tracking, formatter)
  var app               = MAServer.App(config, done)
  var Auth              = require('meanair-auth')
  var model             = require(`meanair-model`)(done)

  model.connect(() => {

    global.DAL          = assign(model.DAL,{ENUM:model.Enum})
    global.cache        = model.cache
    global.analytics    = analytics.connect(DAL)

    cache.get('tags', require('./logic/tags/cached')(DAL).exec, () => {

      global.API          = require('./api/_all')
      global.util         = require('../shared/util')
      global.Wrappers     = require('./services/wrappers/_index')
      global.Wrappers.plumbWrapped('Cloudflare')
      global.mailman      = require('./util/mailman')()
      global.pairbot      = require('./util/pairbot')()

      app.meanair.set(model, {analytics})
                 .merge(Auth)
                 .chain(config.middleware, config.routes)
                 .run()
    })


  })

  return app
}


module.exports = { run }
