function run({config, Honey, track}, done) {

  global.config         = config
  delete config.auth.oauth.bitbucket
  delete config.auth.oauth.angellist

  var app               = Honey.App(config, done)


  var model             = Honey.Model(config, done)
  var formatter         = require('../tmpl/log/analytics')

  model.connect(() => {

    app = app.honey.wire({model})
             .merge(Honey.Auth)
             .track({track,formatter})
             .inflate(config.model.cache)
             .chain(config.middleware, config.routes)
             .run()

    // hmmm setTimeout(ghhh, /prod/i.test(config.env) ? 800 : 300)

  })

  return app
}


module.exports = { run }
