global.users    = require('./../data/users')
global.sinon    = require('sinon')
global.chai     = require('chai')
global.expect   = chai.expect
var System = require('es6-module-loader').System
var initConfig = require('./../../server/config')
var setGlobals = require('./../../server/global')


var config = initConfig('test', __dirname)
setGlobals(config)

var sessionSpec = require('./sessionSpec')
var authSpec = require('./authSpec')


describe('Server Tests', function() {

  before(function(done) {
    System.import('../../index').then(function(index) {      
      global.app = index.run()
      setTimeout(done,150)
    });    
  })

  describe('Session ', sessionSpec)

})

  
global.http = require('supertest')
global.logging = false
global.cookie = null //-- used for maintaining login

global.login = function(initials, cb) {
  if (logging) $log('login:', '/test/setlogin/'+initials)
  return http(global.app).get('/test/setlogin/'+initials).end(function(e,res){
    cookie = res.headers['set-cookie']
    cb()
  })
}

global.get = function(url) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('get:', apiUrl)
  return http(global.app).get(apiUrl).expect('Content-Type', /json/)
}

global.post = function(url, data) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('post:', apiUrl)
  return http(global.app).post(apiUrl).send(data).expect('Content-Type', /json/)
}
