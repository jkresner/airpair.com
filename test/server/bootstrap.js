global.data    = require('./../data/data')
global.sinon    = require('sinon')
global.chai     = require('chai')
global.expect   = chai.expect
var System = require('es6-module-loader').System
var initConfig = require('./../../server/config')
var setGlobals = require('./../../server/global')
var config = initConfig('test', __dirname)
setGlobals(config)


global.logging = false


require('./helpers/http')
global.testDb = require('./helpers/setup')
var sessionSpec = require('./sessionSpec')
var authSpec = require('./authSpec')
var authzSpec = require('./authzSpec')
var postsSpec = require('./postsSpec')
var tagsSpec = require('./tagsSpec')

describe('Server: ', function() {

  before(function(done) {
    System.import('../../index').then(function(index) {      
      global.app = index.run()
      global.UserService = System._loader.modules['server/services/users'].module;

      setTimeout(function(){ testDb.init(done); }, 100)
    });    
  })

  describe('Session: ', sessionSpec)
  describe('Auth: ', authSpec)
  describe('Authz: ', authzSpec)  
  describe('Posts: ', postsSpec)   
  describe('Tags: ', tagsSpec)    

})

  



