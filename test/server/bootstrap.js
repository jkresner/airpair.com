var traceur = require('traceur')
require('traceur-source-maps').install(traceur)
traceur.require.makeDefault(function (filePath) {
  return !~filePath.indexOf('node_modules')
})

require('./helpers/http')
global.data     = require('./../data/data')
global.sinon    = require('sinon')
global.chai     = require('chai')
global.expect   = chai.expect

var initConfig = require('./../../server/util/config')
var setGlobals = require('./../../server/util/global')
var config = initConfig('test', __dirname.replace('/test/server',''))
setGlobals(config)


describe('Server: ', function() {

  before(function(done) {
    global.logging = false
    global.app = require('../../index').run()
    global.testDb = require('./helpers/setup')
    setTimeout(function(){ testDb.init(done) }, 100)
  })

  describe('Session: ', require('./sessionSpec'))
  describe('Auth: ', require('./authSpec'))
  describe('Authz: ', require('./authzSpec'))  
  describe('Posts: ', require('./postsSpec'))   
  describe('Tags: ', require('./tagsSpec'))    
  describe('Analytics: ', require('./analyticsSpec'))    

})

  



