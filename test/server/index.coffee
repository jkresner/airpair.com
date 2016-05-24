SCREAM                       = require('meanair-scream')

appRoot                      = __dirname.replace('test', '')
MAServer                     = require('meanair-server')
tracking                     = require('../../server/app.track')
config                       = MAServer.Config(appRoot, 'test', true)
config.test = auth:
  login:                     { fnName: 'loginCust', url: '/auth/test/login' }



OPTS =
  setup:                    done: -> require('./helpers')
  login:
    clearSessions:          false
    test:                   config.test.auth.login
    fn: (data, cb) ->
      profile = if data.key then DATA.ghProfile(data.key) else data
      token = _.get(profile,"tokens.apcom.token") || "test"
      # $log('fn.profile', profile.login, config.test.auth.login.fn)
      config.test.auth.login.fn.call @, 'github', profile, {token}, cb


SCREAM(OPTS).run (done) ->
  require('../../server/app').run { config, MAServer, tracking }, done
