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
      expect(s.length).to.equal(3)
      expect(s[0].name).to.equal('MongoDB')
      expect(s[0].slug).to.equal('mongodb')
      expect(s[0].desc).to.exist
      expect(s[0]._id).to.exist
      expect(s[1].name).to.equal('mongoengine')
      expect(s[2].name).to.equal('mongoid')
      done()

  it 'Search tags for ios', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/ios', opts, (s) ->
      expect(s.length).to.equal(3)
      expect(s[0].name).to.equal('ios')
      expect(s[1].name).to.equal('ios-simulator')
      expect(s[2].name).to.equal('ios4')
      done()

  it 'Search tags for c++', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/c++', opts, (s) ->
      expect(s.length).to.equal(3)
      expect(s[0].name).to.equal('c++')
      expect(s[1].name).to.equal('c++-cli')
      expect(s[2].name).to.equal('c++0x')
      done()

  it 'Search tags for c#', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/c%23', opts, (s) ->
      expect(s.length).to.equal(3)
      expect(s[0].name).to.equal('c#')
      expect(s[1].name).to.equal('c#-2.0')
      expect(s[2].name).to.equal('c#-3.0')
      done()

  it 'Search tags for ruby on rails', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/ruby on rails', opts, (s) ->
      expect(s.length).to.equal(3)
      expect(s[0].name).to.equal('ruby-on-rails-3')
      expect(s[1].name).to.equal('ruby-on-rails-3.1')
      expect(s[2].name).to.equal('ruby-on-rails-3.2')
      done()

  it 'Search for tags by tokens - RoR', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/RoR', opts, (s) ->
      expect(s.length).to.equal(1)
      expect(s[0].name).to.equal('Rails')
      done()

  it 'Search for tags by tokens - rrr', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/rrr', opts, (s) ->
      expect(s.length).to.equal(1)
      expect(s[0].name).to.equal('Rails')
      done()
