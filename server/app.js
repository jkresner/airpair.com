function run({config, Honey, track}, done) {

  delete config.auth.oauth.bitbucket
  delete config.auth.oauth.angellist
  global.config         = config

  let app               = Honey.App(config, done)
  let model             = Honey.Model(config, done)

  model.connect(() => {

    app = app.honey.wire({model})
             .merge(Honey.Auth)
             .track({track,formatter:require('../tmpl/log/analytics')})
             .inflate(config.model.cache)
             .chain(config.middleware, config.routes)
             .run()

    // hmmm setTimeout(ghhh, /prod/i.test(config.env) ? 800 : 300)

  })

  return app
}


module.exports = { run }
