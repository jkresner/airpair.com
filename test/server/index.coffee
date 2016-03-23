# {colors,initGlobals,initConfig} = require('./../../server/util/_setup')
# config = initConfig('test')
# config.colors = colors
# initGlobals(config)

MAServer         = require('meanair-server')
appRoot          = __dirname.replace('test', '')
config           = MAServer.Config(appRoot, 'test', true)


{initGlobals} = require('./../../server/util/_setup')
initGlobals(config)


opts = { onReady: => require('./helpers') }
opts.login = (req, cb) ->
  fixtureUser = FIXTURE.users[req.body.key]
  if !fixtureUser then throw Error("Could not find FIXTURE.user for {key:#{req.body.key}}")
  {email} = FIXTURE.users[req.body.key]
  require('../../server/services/auth').localLogin.call req, email, config.auth.masterpass, (e,r) ->
    req.session.passport = { user: r } if r
    cb(e,r)


SCREAM = require('meanair-scream')(__dirname, opts)
SCREAM.run({
  config,
  opts: {
    MAServer,
    tracking: require('../../server/app.track'),
    done: (e) => console.log('ee', e)
  }
})

