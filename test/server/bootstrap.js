var System = require('es6-module-loader').System
var initConfig = require('./../../server/config')
var setGlobals = require('./../../server/global')

var sessionSpec = require('./sessionSpec')
global.users    = require('./../data/users')
global.sinon    = require('sinon')
global.chai     = require('chai')
global.expect   = chai.expect

var app = null


var config = initConfig('test', __dirname)
setGlobals(config)


describe('Server Tests', function() {

  before(function(done) {
    System.import('../../index').then(function(index) {      
      global.app = index.run()
      setTimeout(done,150)
    });    
  })

  describe('Session ', sessionSpec)

})

  

