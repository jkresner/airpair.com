require('./setup/flavor')

{initGlobals,initConfig,colors} = require('./../../server/util/_setup')
initGlobals(initConfig('test'))

colors.SPEC = colors.yellow.dim.bold
colors.SUBSPEC = colors.yellow.dim
colors.EXPECTEDERR = colors.magenta.dim
colors.setTheme({
  spec: 'SPEC',
  subspec: 'SUBSPEC',
  expectederr: 'EXPECTEDERR'
})

testHttpHelpers       = require('./helpers/http')


describe 'Server: '.appload, ->

  @timeout(4000)

  before (done) ->
    global.logging    = false
    global.data       = require('./../data/data')
    global.SETUP      = require('./setup/_setup')
    global.timeSeed   = SETUP.timeSeed
    global.newId      = SETUP.newId
    global.app        = require('../../index').run()
    testHttpHelpers.init(app)
    setTimeout(( -> SETUP.init(done) ), 100)


  beforeEach ->
    LOGOUT()


  describe 'Session: '.spec,        require('./sessionSpec')
  describe 'Bots: '.spec,           require('./botsSpec')
  describe 'Auth: '.spec,           require('./authSpec')
  describe 'Authz: '.spec,          require('./authzSpec')
  describe 'Users: '.spec,          require('./usersSpec')
  describe 'User Flows: '.spec,     require('./userFlowsSpec')
  describe 'Experts: '.spec,        require('./expertsSpec')
  describe 'Analytics: '.spec,      require('./analyticsSpec')
  describe 'Tags: '.spec,           require('./tagsSpec')
  describe 'Companys: '.spec,       require('./companysSpec')
  describe 'Rss: '.spec,            require('./rssSpec')
  describe 'Redirects: '.spec,      require('./redirectsSpec')
  describe 'Requests: '.spec,       require('./requestsSpec')
  describe 'Pipeline: '.spec,       require('./requestsAdminSpec')
  describe 'Paymethods: '.spec,     require('./paymethodsSpec')
  describe 'Orders: '.spec,         require('./ordersSpec')
  describe 'Orders: '.spec,         require('./ordersBookingSpec')
  describe 'Posts: '.spec,          require('./postsSpec')
  describe 'Post Reviews: '.spec,   require('./postsReviewsSpec')
  describe 'Bookings: '.spec,       require('./bookingsSpec')
  describe 'Payouts: '.spec,        require('./payoutsSpec')
