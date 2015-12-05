{colors,initGlobals,initConfig} = require('./../../server/util/_setup')


config = initConfig('test')
initGlobals(config)


SCREAM          = require('meanair-scream')
global.SETUP    = require('./helpers/setup')
global.ANONSESSION = (cb) ->
  global.COOKIE = null
  GET '/session/full', cb


opts = { onReady: => require('./helpers') }
opts.login = (req, cb) ->
  fixtureUser = FIXTURE.users[req.body.key]
  if !fixtureUser then throw Error("Could not find FIXTURE.user for {key:#{req.body.key}}")
  {email} = FIXTURE.users[req.body.key]
  fn = require('../../server/services/auth').localLogin
  fn.call req, email, config.auth.masterpass, (e,r) ->
    req.session.passport = { user: r } if r
    cb(e,r)


config.colors = colors


SCREAM(__dirname, config, opts).run()




