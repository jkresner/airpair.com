OPTS = {}
OPTS.onReady = -> require('./helpers')
OPTS.login =
  clearSessions: false
  testUrl: '/auth/test/login'
  testHandler: (req, res, cb) ->
    profile = if req.body.key then DATA.ghProfile(req.body.key) else req.body
    token = _.get(profile,"tokens.apcom.token") || "test"
    # $log('testHandler', profile.emails)
    config.auth.test.loginFn.call req, 'github', profile, {token}, cb


SCREAM = require('meanair-scream')(__dirname, OPTS)


appRoot                      = __dirname.replace('test', '')
MAServer                     = require('meanair-server')
tracking                     = require('../../server/app.track')
config                       = MAServer.Config(appRoot, 'test', true)
config.auth.test             = loginFnName: 'loginCust'


if config.log.app.verbose
  config.log.mw.trace = 'white'


SCREAM.run({ config, MAServer, tracking },
           done: (e) => console.log('test.err', e) if e)
