module.exports = -> describe "API", ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initTags(done)

  after ->
    SETUP.analytics.restore()


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
      expect(s[2].name).to.equal('MongoDB')
      expect(s[2].slug).to.equal('mongodb')
      expect(s[2].desc).to.exist
      expect(s[2]._id).to.exist
      expect(s[1].name).to.equal('mongoengine')
      expect(s[0].name).to.equal('mongoid')
      done()


  it 'Search tags for ios', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/ios', opts, (s1) ->
      expect(s1.length).to.equal(3)
      expect(s1[0].name).to.equal('ios')
      expect(s1[1].name).to.equal('ios-simulator')
      expect(s1[2].name).to.equal('ios5')
      GET '/tags/search/ios simulator', opts, (s2) ->
        expect(s2[0].name).to.equal('ios-simulator')
        GET '/tags/search/ios sim', opts, (s3) ->
          expect(s2[0].name).to.equal('ios-simulator')
          done()


  it 'Search tags for c++', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/c++', opts, (s1) ->
      GET '/tags/search/c+', opts, (s2) ->
        expect(s1.length).to.equal(3)
        expect(s1[0].name).to.equal('c++')
        expect(s2[0].name).to.equal('c++')
        done()


  it.skip 'Search tags for c#', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/c%23', opts, (s) ->
      expect(s.length).to.equal(4)
      expect(s[0].name).to.equal('c#')
      expect(s[1].name).to.equal('c#-2.0')
      expect(s[2].name).to.equal('c#-3.0')
      done()


  it 'Search tags for android', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/android', opts, (s1) ->
      expect(s1[0].slug).to.equal('android')
      GET '/tags/search/droid', opts, (s2) ->
        # expect(s2[0].slug).to.equal('android')
        GET '/tags/search/android x86', opts, (s3) ->
          expect(s3[0].slug).to.equal('android-x86')
          done()


  it.skip 'Search tags for angularjs', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/angularjs', opts, (s1) ->
      expect(s1[0].slug).to.equal('angularjs')
      GET '/tags/search/angular', opts, (s2) ->
        expect(s2[0].slug).to.equal('angularjs')
        GET '/tags/search/angular-js', opts, (s3) ->
          # expect(s3[0].slug).to.equal('angularjs')
          GET '/tags/search/angular js', opts, (s4) ->
            # expect(s4[0].slug).to.equal('angularjs')
            GET '/tags/search/angular 1.2', opts, (s5) ->
              # expect(s5[0].slug).to.equal('angularjs-1.2')
              GET '/tags/search/angular-1.2', opts, (s6) ->
                # expect(s6[0].slug).to.equal('angularjs-1.2')
                done()


  it.skip 'Search tags for ruby on rails', (done) ->
    opts = { unauthenticated: true }
    GET '/tags/search/ruby on rails', opts, (s1) ->
      # expect(s1[0].slug).to.equal('ruby-on-rails')
      GET '/tags/search/RoR', opts, (s2) ->
        expect(s2[0].slug).to.equal('ruby-on-rails')
        GET '/tags/search/rrr', opts, (s3) ->
          expect(s3[0].slug).to.equal('ruby-on-rails')
          GET '/tags/search/ruby-on-rails', opts, (s4) ->
            # expect(s4[0].slug).to.equal('ruby-on-rails')
            GET '/tags/search/rails', opts, (s5) ->
              expect(s5[0].slug).to.equal('ruby-on-rails')
              GET '/tags/search/ruby', opts, (s6) ->
                expect(s6[0].slug).to.equal('ruby')
                done()
