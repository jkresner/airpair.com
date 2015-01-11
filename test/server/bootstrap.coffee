traceur = require('traceur')
require('traceur-source-maps').install(traceur)
traceur.require.makeDefault (filePath) ->
  !~filePath.indexOf('node_modules') && !~filePath.indexOf('test') != 0

setGlobals = require('./../../server/util/global')
initConfig = require('./../../server/util/config')
appdir = __dirname.replace('/test/server','').replace('\\test\\server','')
config = initConfig('test', appdir)
config.mailProvider = { send: ()=>{} }
setGlobals(config)

require('./helpers/http')
global.data     = require('./../data/data')
global.sinon    = require('sinon')
global.chai     = require('chai')
global.expect   = chai.expect
global.expectIdsEqual = (id1, id2) -> expect(_.idsEqual(id1,id2)).to.be.true
global.expectStartsWith = (str,start) -> expect(str.indexOf(start)).to.equal(0)

describe 'Server: ', ->

  before (done) ->
    global.logging = false
    global.app = require('../../index').run()
    global.testDb = require('./helpers/setup')
    global.SETUP = global.testDb
    setTimeout(( -> testDb.init(done) ), 100)

  beforeEach ->
    SETUP.clearIdentity()

  describe('Session: ', require('./sessionSpec'))
  describe('Analytics: ', require('./analyticsSpec'))
  describe('Bots: ', require('./botsSpec'))
  describe('Tags: ', require('./tagsSpec'))
  describe('Auth: ', require('./authSpec'))
  describe('Authz: ', require('./authzSpec'))
  describe('Companys: ', require('./companysSpec'))
  describe('Rss: ', require('./rssSpec'))
  describe('Redirects: ', require('./redirectsSpec'))
  describe('Requests: ', require('./requestsSpec'))
  describe('Pipeline: ', require('./requestsAdminSpec'))
  describe('Paymethods: ', require('./paymethodsSpec'))
  describe('Orders: ', require('./ordersSpec'))
  # describe('Orders: ', require('./ordersMembershipSpec'))
  describe('Orders: ', require('./ordersBookingSpec'))
  describe('Posts: ', require('./postsSpec'))
  describe('Bookings: ', require('./bookingsSpec'))
  describe('Payouts: ', require('./payoutsSpec'))

