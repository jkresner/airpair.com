global.data    = require('./../data/data')
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
  describe('Auth ', authSpec)

})

  
global.http = require('supertest')
global.logging = false
global.cookie = null //-- used for maintaining login

global.login = function(initials, cb) {
  if (logging) $log('login:', '/test/setlogin/'+initials)
  return http(global.app).get('/test/setlogin/'+initials).end(function(e,res){
    if (e) return done(err)
    cookie = res.headers['set-cookie']
    cb(e)
  })
}

global.get = function(url, opts, cb) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('get:', apiUrl)

  var sessionCookie = cookie
  if (opts.unauthenticated) { sessionCookie = null }

  return http(global.app)
    .get(apiUrl)
    .set('cookie',sessionCookie)
    .expect('Content-Type', /json/)
    .expect(opts.status||200)
    .end(function(err, resp){
      if (err) throw err
      else cb(resp.body)
    })
}

global.post = function(url, data, opts, cb) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('post:', apiUrl)

  var sessionCookie = cookie
  if (opts.unauthenticated) { sessionCookie = null }

  return http(global.app)
    .post(apiUrl)
    .send(data)
    .set('cookie',sessionCookie)
    .expect(opts.status||200)
    .expect('Content-Type', /json/)
    .end(function(err, resp){
      if (err) throw err
      else cb(resp.body, resp)
    })

}
