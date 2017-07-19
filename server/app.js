function run({config, Honey, track}, done) {

  global.config         = config
  delete config.auth.oauth.bitbucket
  delete config.auth.oauth.angellist

  var app               = Honey.App(config, done)

  var {bundles,host} = config.http.static
  // var hosted = ['css/v1fonts.css','css/v1libs.css']
  // if (/prod/.test(config.env)) hosted = Object.keys(bundles)
  // for (var b of hosted)
    // bundles[b] = `${host}${bundles[b]}`
  var js = {}, css = {}
  for (var bundle in bundles) {
    var href = bundles[bundle]
    var key = bundle.split('.')[0] // remove extension
    if (key.match(/^(js\/)/)) js[key.replace('js/','')] = href
    if (key.match(/^(css\/)/)) css[key.replace('css/','')] = href
  }

  assign(app.locals, {js,css,static:{host},analytics:config.log.analytics.on})


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
