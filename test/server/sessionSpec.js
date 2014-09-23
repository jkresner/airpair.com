module.exports = function()
{
  describe("API", function() {

    it('gets 401 on unauthenticated session', function(done) {
      var opts = { status: 401, unauthenticated: true }
      get('/session', opts, function() { done() })
    })
  
    it('gets 401 on unauthenticated full session', function(done) {
      var opts = { status: 401, unauthenticated: true }
      get('/session', opts, function() { done() })
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