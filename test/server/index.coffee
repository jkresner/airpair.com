SCREAM                       = require('screamjs')
Honey                        = require('honeycombjs')
track                        = require('../../server/app.track')
test = auth: { login: { fnName: 'loginCust', url: '/auth/test/login' } }

OPTS =
  setup:           done: -> require('./helpers')
  login:
    clearSessions: false
    test:          test.auth.login
    fn: (data, cb) ->
      profile = if data.key then DATA.ghProfile(data.key) else data
      token = _.get(profile,"tokens.apcom.token") || "test"
      config.test.auth.login.fn.call @, 'github', profile, {token}, cb



SCREAM(OPTS).run (done) ->

  appRoot     = __dirname.replace('test', '')
  config      = Honey.Configure(appRoot, 'test', true)
  config.test = test
  for b in ['css/libs.css', 'css/index.css', 'css/adm.css', 'js/index.js', 'css/v1libs.css']
    config.http.static.bundles[b] = "https://static.airpair.com#{config.http.static.bundles[b]}"

  require('../../server/app').run { config, Honey, track }, done
