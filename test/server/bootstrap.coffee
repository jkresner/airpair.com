require('./setup/flavor')

{initGlobals,initConfig,colors} = require('./../../server/util/_setup')

colors.SPEC = colors.yellow.dim.bold
colors.SUBSPEC = colors.yellow.dim
colors.EXPECTEDERR = colors.magenta.dim
colors.APPLOAD = colors.white
colors.setTheme({
  spec: 'SPEC',
  subspec: 'SUBSPEC',
  expectederr: 'EXPECTEDERR',
  appload: 'APPLOAD'
})

initGlobals(initConfig('test'))

global.itDone = (fn) ->
  (dn) ->
    global.DONE = dn
    fn.call(@, dn)

spec = (ctx, name, path, only) ->
  path = name.toLowerCase() if !path
  desc = if only then describe.only else describe
  desc.call ctx, "", ->
    # before ->
      # $timelapsed("BEFORE: #{name}")
    after ->
      SETUP.analytics.off()
      $timelapsed("Total(ms): #{name}")
    describe "#{name}: ".spec, require("./#{path}Spec")

spec.only = (ctx, name, path) ->
  spec(ctx,name,path,true)


# config.mongoUri = "mongodb://localhost/airpair_dev"


describe 'Server: '.appload, ->

  @timeout(4000)

  before (done) ->
    # $timelapsed("BEFORE start")
    global.logging            = false
    global.verboseErrHandler  = false   # true => lots of red detail
    global.withoutStubs       = false    # true => real (slow) apis calls
    $log("   Stubs:".white, if withoutStubs then "TURNED OFF!".red else "on".gray)
    global.db                 = require('./helpers/db')
    global.ObjectId           = db.ObjectId
    global.ISODate            = db.ISODate
    # $timelapsed("DB done")
    # $timelapsed("SETUP done")
    global.data               = require('./../data/data')
    global.SETUP              = require('./setup/_setup')
    global.timeSeed           = SETUP.timeSeed
    global.newId              = SETUP.newId
    global.app                = require('../../index').run()
    # $timelapsed("APP done")
    global.stubs              = SETUP.initStubs()
    require('./helpers/http').init(app)
    # $timelapsed("HELPERS done")
    SETUP.init.call(@, done)

  beforeEach ->
    LOGOUT()


  spec @, 'Session'
  spec @, 'Bots'
  spec @, 'Auth'
  spec @, 'Authz', 'authzAdmin'
  spec @, 'Authz'
  spec @, 'Users'
  spec @, 'Users Cohort', 'usersCohort'
  spec @, 'User Flors', 'userFlows'
  spec @, 'Chat'
  spec @, 'Experts'
  spec @, 'Experts', 'expertsMojo'
  spec @, 'Analytics'
  spec @, 'Tags'
  spec @, 'Companys'
  spec @, 'Redirects'
  spec @, 'Requests', 'requests'
  spec @, 'Pipeline', 'requestsAdmin'
  # spec @, 'Paymethods'
  spec @, 'Orders'
  spec @, 'Orders', 'ordersBooking'
  spec @, 'Orders', 'ordersDeals'
  spec @, 'Orders', 'ordersAdmin'
  # # spec @, 'Posts'
  spec @, 'Post Reviews', 'postsReviews'
  spec @, 'Bookings'
  spec @, 'Bookings', 'bookingsAdmin'
  spec @, 'Payouts'
  spec @, 'Mail', 'mailman'
  spec @, 'Pairbot', 'pairbot'

  # spec.only @, 'Rss'
