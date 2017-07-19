SCREAM                       = require('screamjs')
test = auth: { login: { fnName: 'loginCust', url: '/auth/test/login' } }
  # login:                     { fnName: 'loginAuthor', url: '/auth/test/login' }

OPTS =
  setup:           done: -> require('./helpers')
  login:
    clearSessions: false
    test:          test.auth.login
    fn: (key, cb) ->
      profile = FIXTURE.users[key.key||key].auth.gh
      # $log('LOGIN.key', key, profile)
      token = _.get(profile,"tokens.apcom.token") || "test"
      config.test.auth.login.fn.call @, 'github', profile, {token}, cb



SCREAM(OPTS).run (done) ->
  # {post_readme} = FIXTURE.templates
  # DB.ensureDocs 'Template', [post_readme], ->

  Honey       = require('honeycombjs')
  appRoot     = __dirname.replace('test', '')
  config      = Honey.Configure(appRoot, 'test', true)
  config.test = test

  if !process.env.LOG_APP_VERBOSE
    delete config.log.it.mw.forbid

  # for b in ['css/libs.css', 'css/index.css', 'css/adm.css', 'js/index.js', 'css/v1libs.css']
    # config.http.static.bundles[b] = "https://static.airpair.com#{config.http.static.bundles[b]}"

  require('../../server/app').run { config, Honey }, done
