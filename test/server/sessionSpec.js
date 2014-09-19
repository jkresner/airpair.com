var http = require('supertest')
var logging = false
var cookie; 
var get = function(url) {
  var apiUrl = '/v1/api'+url
  if (logging) $log('get:', apiUrl)
  return http(global.app).get(apiUrl).expect('Content-Type', /json/);
}

var login = function(initials, cb) {
  if (logging) $log('login:', '/test/setlogin/'+initials)
  return http(global.app).get('/test/setlogin/'+initials).end(function(e,res){
    cookie = res.headers['set-cookie'];
    cb()
  })
}

module.exports = function()
{
  describe("API", function() {

    it('gets 403 on unauthenticated session', function(done) {
      get('/session').expect(403)
        .end(function(err, res){
          if (err) throw err;
          done()
        });
    })
  
    it('gets 403 on unauthenticated full session', function(done) {
      get('/session/full').expect(403)
        .end(function(err, res){
          if (err) throw err;
          done()
        });
    })

    it('gets slim authenticated session', function(done) {
      login('scap', function() {
        get('/session').set('cookie',cookie).expect(200)
          .end(function(err, res){
            var s = res.body
            expect(s._id).to.equal("5418c03f8f8c80299bcc4783")
            expect(s.email).to.equal("sc@airpair.com")
            expect(s.name).to.equal("Shane")
            expect(s.avatar).to.equal("//0.gravatar.com/avatar/54856fdf0610d64c79bf82b43d56f356")
            done()
          });    
      });
    })
  }) 
}