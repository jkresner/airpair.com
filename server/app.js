function run({config, MAServer,track}, done) {

  global.config         = config
  var app               = MAServer.App(config, done)
  var auth              = require('meanair-auth')
  var model             = require(`meanair-model`)(done)
  var formatter         = require('../templates/log/analytics')

  model.connect(() => {

    global.DAL          = assign(model.DAL,{ENUM:model.Enum})
    global.cache        = model.cache

    global.API          = require('./api/_all')
    global.util         = require('../shared/util')
    global.Wrappers     = require('./services/wrappers/_index')
    global.mailman      = require('./util/mailman')()
    global.pairbot      = require('./util/pairbot')()

    app.meanair.set(model)
               .track(config.analytics, {track,formatter})
               .merge(auth)
               .chain(config.middleware, config.routes, cache.require)
               .run()

  })

  return app
}


module.exports = { run }
