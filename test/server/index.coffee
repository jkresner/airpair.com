{colors,initGlobals,initConfig} = require('./../../server/util/_setup')


config = initConfig('test')
initGlobals(config)


SCREAM          = require('meanair-scream')
global.SETUP    = require('./helpers/setup')
global.newId    = -> new DB.ObjectId()


loginHandler = (req, cb) ->
  {email} = FIXTURE.users[req.body.key]
  fn = require('../../server/services/users').localLogin
  fn.call req, email, config.auth.masterpass, (e,r) ->
    req.session.passport = { user: r } if r
    cb(e,r)

colors.setTheme({
  spec: ['yellow','dim','bold']
  # subspec: ['yellow','dim']
  expectederr: 'red'
  appload: 'white'
  update: 'yellow'
  trace: 'grey'
  validation: 'blue'
  wrappercall: 'white'
})

config.colors = colors

config.log.auth = false

SCREAM(__dirname, config, loginHandler).run()


    # $timelapsed("BEFORE start")
    # global.verboseErrHandler  = true   # true => lots of red detail
    # global.withoutStubs       = false    # true => real (slow) apis calls
    # $log("   Stubs:".white, if withoutStubs then "TURNED OFF!".red else "on".gray)

    # global.data               = require('./../data/data')
    # global.SETUP              = require('./setup/_setup')
    # global.timeSeed           = SETUP.timeSeed
    # global.newId              = SETUP.newId

    # global.stubs              = SETUP.initStubs()
