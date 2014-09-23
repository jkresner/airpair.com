module.exports = function()
{
  describe("API", function() {

    it('gets 401 on unauthenticated session for users own posts', function(done) {
      var opts = { status: 401, unauthenticated: true }
      get('/posts/me', opts, function() { done() })
    })
  
  })
}