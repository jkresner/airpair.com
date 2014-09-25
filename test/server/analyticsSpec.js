module.exports = function() {
 
  describe("Tracking: ", function() {

    before(function(done) {
      done()
    })


    it('Can track an event', function(done) {
      analytics.track('jonnk','test', { hair: 'blond' }, done)
    })


  })

}