MAServer                     = require('meanair-server')
appRoot                      = __dirname.replace('test', '')
config                       = MAServer.Config(appRoot, 'test', true)
config.auth.test = loginFnName: 'loginCust'


OPTS = {}
OPTS.onReady = -> require('./helpers')
OPTS.login = (req, cb) ->
  # fixtureUser = FIXTURE.users[req.body.key]
  # if !fixtureUser then throw Error("Could not find FIXTURE.user for {key:#{req.body.key}}")
  # {email} = FIXTURE.users[req.body.key]
  # require('../../server/services/auth').localLogin.call req, email, config.auth.masterpass, (e,r) ->
  #   req.session.passport = { user: r } if r
  #   cb(e,r)
  profile = DATA.loginProfile(req.body.key)
  token = _.get(profile,"tokens.apcom.token") || "test"
  config.auth.test.loginFn.call req, 'github', profile, {token}, cb


SCREAM = require('meanair-scream')(__dirname, OPTS)
SCREAM.run({
  config,
  opts: {
    MAServer,
    tracking: require('../../server/app.track'),
    done: (e) => console.log('test.err', e) if e
  }
})

