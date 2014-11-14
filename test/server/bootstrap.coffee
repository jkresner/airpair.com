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

describe 'Server: ', ->

  before (done) ->
    @timeout(10000)
    global.logging = false
    global.app = require('../../index').run()
    global.testDb = require('./helpers/setup')
    setTimeout(( -> testDb.init(done) ), 100)


  describe('Session: ', require('./sessionSpec'))
  describe('Bots: ', require('./botsSpec'))
  describe('Tags: ', require('./tagsSpec'))
  describe('Auth: ', require('./authSpec'))
  describe('Authz: ', require('./authzSpec'))
  describe('Posts: ', require('./postsSpec'))
  describe('Analytics: ', require('./analyticsSpec'))
  describe('Redirects: ', require('./redirectsSpec'))
  describe('Orders: ', require('./paymethodsSpec'))
  describe('Orders: ', require('./ordersSpec'))
  describe('Orders: ', require('./ordersMembershipSpec'))
  describe('Orders: ', require('./ordersBookingSpec'))

