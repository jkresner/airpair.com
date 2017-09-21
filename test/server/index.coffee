SCREAM                       = require('screamjs')


opts =
  setup:
    done:          require('./helpers')
  login:
    accept:        'application/json'
    logic:         'oauth'
    url:           '/auth/test/login'
    handler: (data, cb) ->
      user = FIXTURE.users[data.key]
      profile = user.auth.gh
      existing = if user._id? then user else null
      token = _.get(profile,"tokens.apcom.token") || "test"
      # $log('LOGIN.key', data.key, profile)
      opts.login.fn.call @, existing, 'github', profile, {token}, cb



SCREAM(opts).run (done) ->
  Honey                      = require('honeycombjs')
  appRoot                    = __dirname.replace('test', '')
  config                     = Honey.Configure(appRoot, 'test', true)
  config.routes.auth.test    = { on:true, login: opts.login }
  app                        = require(join(appRoot,'app.js')).run({config,Honey},done)
