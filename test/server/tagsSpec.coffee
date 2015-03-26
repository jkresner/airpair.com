module.exports = -> describe "API".subspec, ->


  it '401 on unauthenticated getByTagSlug', itDone ->
    opts = status: 401, unauthenticated: true
    GET('/tags/angularjs', opts, -> DONE() )



  it 'getByTagSlug when logged in', itDone ->
    LOGIN 'admin', (s) ->
      GET '/tags/angularjs', {}, (t) ->
        expect(t.slug).to.equal('angularjs')
        expect(t.name).to.equal('AngularJS')
        expect(t.short).to.equal('Angular')
        DONE()


  it 'Search tags when anonymous', itDone ->
    GET '/tags/search/mon', {}, (s) ->
      expect(s.length).to.equal(3)
      expect(s[2].name).to.equal('MongoDB')
      expect(s[2].slug).to.equal('mongodb')
      expect(s[2].desc).to.exist
      expect(s[2]._id).to.exist
      expect(s[1].name).to.equal('mongoengine')
      expect(s[0].name).to.equal('mongoid')
      DONE()


  it.skip 'Search tags for ios', itDone ->
    GET '/tags/search/ios', {}, (s1) ->
      expect(s1.length).to.equal(4)
      expect(s1[0].name).to.equal('ios')
      expect(s1[1].name).to.equal('ios-simulator')
      expect(s1[2].name).to.equal('ios5')
      GET '/tags/search/ios simulator', {}, (s2) ->
        expect(s2[0].name).to.equal('ios-simulator')
        GET '/tags/search/ios sim', {}, (s3) ->
          expect(s2[0].name).to.equal('ios-simulator')
          DONE()


  it 'Search tags for c++', itDone ->
    GET '/tags/search/c++', {}, (s1) ->
      expect(s1.length).to.equal(4)
      expect(s1[0].name).to.equal('c++')
      GET '/tags/search/c+', {}, (s2) ->
        expect(s2[0].name).to.equal('c++')
        DONE()


  it 'Search tags for c#', itDone ->
    GET '/tags/search/c%23', {}, (s) ->
      expect(s.length).to.equal(4)
      expect(s[0].name).to.equal('c#')
      expect(s[1].name).to.equal('c++')
      expect(s[2].name).to.equal('c#-4.0')
      expect(s[3].name).to.equal('c#-3.0')
      DONE()


  it 'Search tags for android', itDone ->
    GET '/tags/search/android', {}, (s1) ->
      expect(s1[0].slug).to.equal('android')
      GET '/tags/search/droid', {}, (s2) ->
        expect(s2[0].slug).to.equal('android')
        GET '/tags/search/android x86', {}, (s3) ->
          expect(s3[0].slug).to.equal('android-x86')
          DONE()


  it.skip 'Search tags for angularjs', itDone ->
    GET '/tags/search/angularjs', {}, (s1) ->
      expect(s1[0].slug).to.equal('angularjs')
      GET '/tags/search/angular', {}, (s2) ->
        expect(s2[0].slug).to.equal('angularjs')
        GET '/tags/search/angular-js', {}, (s3) ->
          # $log('s3', s3)
          # expect(s3[0].slug).to.equal('angularjs')
          GET '/tags/search/angular js', {}, (s4) ->
            # expect(s4[0].slug).to.equal('angularjs')
            GET '/tags/search/angular 1.2', {}, (s5) ->
              # expect(s5[0].slug).to.equal('angularjs-1.2')
              GET '/tags/search/angular-1.2', {}, (s6) ->
                # expect(s6[0].slug).to.equal('angularjs-1.2')
                DONE()


  it.skip 'Search tags for ruby on rails', itDone ->
    GET '/tags/search/ruby on rails', {}, (s1) ->
      # expect(s1[0].slug).to.equal('ruby-on-rails')
      GET '/tags/search/RoR', {}, (s2) ->
        expect(s2[0].slug).to.equal('ruby-on-rails')
        GET '/tags/search/rrr', {}, (s3) ->
          expect(s3[0].slug).to.equal('ruby-on-rails')
          GET '/tags/search/ruby-on-rails', {}, (s4) ->
            # expect(s4[0].slug).to.equal('ruby-on-rails')
            GET '/tags/search/rails', {}, (s5) ->
              expect(s5[0].slug).to.equal('ruby-on-rails')
              GET '/tags/search/ruby', {}, (s6) ->
                expect(s6[0].slug).to.equal('ruby')
                DONE()
