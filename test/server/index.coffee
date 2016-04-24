appRoot                      = __dirname.replace('test', '')
MAServer                     = require('meanair-server')
tracking                     = require('../../server/app.track')
config                       = MAServer.Config(appRoot, 'test', true)
config.auth.test =
  loginFnName: 'loginCust'

if process.env.LOG_MW_TRACE
  config.log.mw.trace = 'white'

OPTS = {}
OPTS.onReady = -> require('./helpers')
OPTS.login =
  testUrl: '/auth/test/oauth'
  testHandler: (req, res, cb) ->
    profile = if req.body.key then DATA.ghProfile(req.body.key) else req.body
    token = _.get(profile,"tokens.apcom.token") || "test"
    config.auth.test.loginFn.call req, 'github', profile, {token}, cb


SCREAM = require('meanair-scream')(__dirname, OPTS)
SCREAM.run({ config, MAServer, tracking },
           done: (e) => console.log('test.err', e) if e)
