module.exports = function()
{
  describe("API", function() {

    before(function(done) {
      testDb.initTags(done)
    })


    it('gets 401 on getByTagSlug', function(done) {
      var opts = { status: 401, unauthenticated: true }
      get('/tags/angularjs', opts, function() { done() })
    })


    it('Can getByTagSlug when logged in', function(done) {
      login('admin', data.users.admin, function() {
        get('/tags/angularjs', {}, function(s) { 
          expect(s.slug).to.equal('angularjs')
          expect(s.name).to.equal('AngularJS')
          expect(s.short).to.equal('Angular')          
          done()
        })
      })
    })


    it('can search tags when anonymous', function(done) {
      var opts = { unauthenticated: true }
      get('/tags/search/mon', opts, function(s) { 
        expect(s.length).to.equal(1)
        expect(s[0].name).to.equal('mongodb')        
        expect(s[0].slug).to.equal('mongodb')        
        expect(s[0].desc).to.exist
        expect(s[0]._id).to.exist        
        done() 
      })
    })


  })
}