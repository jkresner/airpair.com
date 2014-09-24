var Traceur = require('traceur')
Traceur.require.makeDefault(function(filename) {
  return !(/node_modules/.test(filename))
});

require('./helpers/http')
global.data    = require('./../data/data')
global.sinon    = require('sinon')
global.chai     = require('chai')
global.expect   = chai.expect

var initConfig = require('./../../server/config')
var setGlobals = require('./../../server/global')
var config = initConfig('test', __dirname)
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

})

  



