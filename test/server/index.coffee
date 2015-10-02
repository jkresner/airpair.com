colors           = require('colors')
colors.setTheme({
  spec: ['yellow','dim','bold']
  subspec: ['yellow','dim']
  expectederr: ['magenta','dim']
  appload: 'white'
  update: 'yellow'
  trace: 'grey'
  validation: 'blue'
  wrappercall: 'white'
})

{initGlobals,initConfig} = require('./../../server/util/_setup')

config = initConfig('test')
initGlobals(config)


SCREAM          = require('meanair-scream')



loginLogic = (req, callback) ->
  u = FIXTURE.User[req.params.id]
  fn = require('../../server/services/users').localLogin
  fn.call(req, u.email, conf.auth.masterpass, callback)


SCREAM(__dirname, config, loginLogic).run()


    # $timelapsed("BEFORE start")
    # global.verboseErrHandler  = true   # true => lots of red detail
    # global.withoutStubs       = false    # true => real (slow) apis calls
    # $log("   Stubs:".white, if withoutStubs then "TURNED OFF!".red else "on".gray)

    # global.data               = require('./../data/data')
    # global.SETUP              = require('./setup/_setup')
    # global.timeSeed           = SETUP.timeSeed
    # global.newId              = SETUP.newId

    # global.stubs              = SETUP.initStubs()
