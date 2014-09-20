module.exports = function()
{
  describe("API", function() {

    it('gets 403 on unauthenticated session', function(done) {
      get('/session').expect(403)
        .end(function(e, r){
          if (e) throw e;
          done()
        })
    })
  
    it('gets 403 on unauthenticated full session', function(done) {
      get('/session/full').expect(403)
        .end(function(e, r){
          if (e) throw e;
          done()
        })
    })

    it('gets slim authenticated session', function(done) {
      login('scap', function() {
        get('/session').set('cookie',cookie).expect(200)
          .end(function(e, r){
            var s = r.body
            expect(s._id).to.equal("5418c03f8f8c80299bcc4783")
            expect(s.email).to.equal("sc@airpair.com")
            expect(s.name).to.equal("Shane")
            expect(s.avatar).to.equal("//0.gravatar.com/avatar/54856fdf0610d64c79bf82b43d56f356")
            done()
          })    
      })
    })
  }) 
}