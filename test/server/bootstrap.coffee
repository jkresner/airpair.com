traceur = require('traceur')
require('traceur-source-maps').install(traceur)
traceur.require.makeDefault (filePath) ->
  !~filePath.indexOf('node_modules') && !~filePath.indexOf('test') != 0


require('./helpers/http')
global.data     = require('./../data/data')
global.sinon    = require('sinon')
global.chai     = require('chai')
global.expect   = chai.expect


initConfig = require('./../../server/util/config')
setGlobals = require('./../../server/util/global')
appdir = __dirname.replace('/test/server','').replace('\\test\\server','')
config = initConfig('test', appdir)
setGlobals(config)

describe 'Server: ', ->

  before (done) ->
    global.logging = false
    global.app = require('../../index').run()
    global.testDb = require('./helpers/setup')
    setTimeout(( -> testDb.init(done) ), 100)


  describe('Session: ', require('./sessionSpec'))
  describe('Tags: ', require('./tagsSpec'))
  describe('Auth: ', require('./authSpec'))
  describe('Authz: ', require('./authzSpec'))
  describe('Posts: ', require('./postsSpec'))
  describe('Analytics: ', require('./analyticsSpec'))
  describe('Redirects: ', require('./redirectsSpec'))
  describe('Billing: ', require('./billingSpec'))
  describe('Orders: ', require('./ordersSpec'))
  describe('Orders: ', require('./ordersMembershipSpec'))
  describe('Orders: ', require('./ordersBookingSpec'))

