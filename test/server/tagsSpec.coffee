module.exports = -> describe "API", ->

  before (done) ->
    stubAnalytics()
    testDb.initTags(done)


  after (done) ->
    resotreAnalytics()
    done()


  it '401 on unauthenticated getByTagSlug', (done) ->
    opts = status: 401, unauthenticated: true
    GET('/tags/angularjs', opts, -> done() )



  it 'getByTagSlug when logged in', (done) ->
    LOGIN 'admin', data.users.admin, (s) ->
      GET '/tags/angularjs', {}, (t) ->
        expect(t.slug).to.equal('angularjs')
        expect(t.name).to.equal('AngularJS')
        expect(t.short).to.equal('Angular')
        done()



  it 'Search tags when anonymous', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/mon', opts, (s) ->
      expect(s.length).to.equal(1)
      expect(s[0].name).to.equal('MongoDB')
      expect(s[0].slug).to.equal('mongodb')
      expect(s[0].desc).to.exist
      expect(s[0]._id).to.exist
      done()

