module.exports = function()
{
  describe("API", function() {

    before(function(done) {
      testDb.initTags(done)
    })

    it('Gets sessionId on anonymous session', function(done) {
      var opts = { unauthenticated: true }
      get('/session', opts, function(s) { 
        expect(s.authenticated).to.be.false
        expect(s.sessionID).to.exist
        done() 
      })
    })
  
    it('Gets sessionId on anonymous full session', function(done) {
      var opts = { unauthenticated: true }
      get('/session', opts, function(s) { 
        expect(s.authenticated).to.be.false
        expect(s.sessionID).to.exist
        done() 
      })
    })

  
    it('Can save tag data to anonymous session', function(done) {
      http(global.app)
        .put('/v1/api/users/me/tag/node.js')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, resp){
          if (err) throw err
          cookie = resp.headers['set-cookie']
          get('/session', {}, function(s) { 
            expect(s.authenticated).to.be.false
            expect(s.sessionID).to.exist
            expect(s.tags).to.exist            
            expect(s.tags.length).to.equal(1)
            expect(s.tags[0].name).to.equal('Node.JS') 
            //-- Remove the tag
            put('/users/me/tag/node.js', {}, {}, function(s2){
              expect(s2.authenticated).to.be.false
              expect(s2.sessionID).to.equal(s.sessionID)
              expect(s2.tags).to.exist            
              expect(s2.tags.length).to.equal(0)
              done() 
            })
          })
        })
    })

  
    it('Can save bookmark data to anonymous session', function(done) {
      $log('TODO write test')
      done()
    })


    it('gets slim authenticated session', function(done) {
      login('scap', data.users.scap, function() {
        get('/session', {}, function(r) {
          expect(r._id).to.equal("5418c03f8f8c80299bcc4783")
          expect(r.email).to.equal("sc@airpair.com")
          expect(r.name).to.equal("Shane")      
          expect(r.avatar).to.equal("//0.gravatar.com/avatar/54856fdf0610d64c79bf82b43d56f356")
          done()
        })
      })
    })

  })
}