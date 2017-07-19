IT '"mon"', ->
  GET '/tags/search?q=mon', (s) ->
    expect(s.length).to.equal(3)
    expect(s[2]._id).to.exist
    expect(s[2].name).to.equal('MongoDB')
    expect(s[2].short).to.equal('Mongo')
    expect(s[2].slug).to.equal('mongodb')
    expect(s[2].desc).to.exist
    expect(s[2].tokens).to.be.undefined
    expect(s[2].soId).to.be.undefined
    expect(s[2].so).to.be.undefined
    expect(s[2].gh).to.be.undefined
    expect(s[2].ghId).to.be.undefined
    expect(s[2].meta).to.be.undefined
    expect(s[0].name).to.match(/mongoengine|mongoid/)
    expect(s[1].name).to.match(/mongoengine|mongoid/)
    DONE()


IT '"ios"', ->
  GET '/tags/search?q=ios', {}, (s1) ->
    expect(s1.length).to.equal(4)
    expect(s1[0].name).to.equal('iOS')
    expect(s1[0].slug).to.equal('ios')
    expect(s1[1].name).to.equal('ios-simulator')
    # expect(s1[2].name).to.equal('ios5')
    expect(s1[2].name).to.equal('xamarin.ios')
    GET '/tags/search?q=ios simulator', {}, (s2) ->
      expect(s2[0].name).to.equal('ios-simulator')
      GET '/tags/search?q=ios sim', {}, (s3) ->
        expect(s2[0].name).to.equal('ios-simulator')
        DONE()


IT '"c++"', ->
  q1=encodeURIComponent("c++")
  q2=encodeURIComponent("c++")
  GET "/tags/search?q=#{q1}", {}, (s1) ->
  # GET '/tags/search?q=c++', {}, (s1) ->
    expect(s1.length).to.equal(4)
    expect(s1[0].name).to.equal('c++')
    # GET '/tags/search?q=c+', {}, (s2) ->
    GET "/tags/search?q=#{q2}", {}, (s2) ->
      expect(s2[0].name).to.equal('c++')
      DONE()


IT '"c#"', ->
  GET '/tags/search?q=c%23', {}, (s) ->
    expect(s.length).to.equal(4)
    expect(s[0].name).to.equal('c#')
    expect(s[1].name).to.equal('c++')
    expect(s[2].name).to.equal('c#-4.0')
    expect(s[3].name).to.equal('c#-3.0')
    DONE()


IT '"android"', ->
  GET '/tags/search?q=android', {}, (s1) ->
    expect(s1[0].slug).to.equal('android')
    GET '/tags/search?q=droid', {}, (s2) ->
      expect(s2[0].slug).to.equal('android')
      GET '/tags/search?q=android x86', {}, (s3) ->
        expect(s3[0].slug).to.equal('android-x86')
        DONE()


IT '"angularjs"', ->
  GET '/tags/search?q=angularjs', {}, (s1) ->
    expect(s1[0].slug).to.equal('angularjs')
    GET '/tags/search?q=angular', {}, (s2) ->
      expect(s2[0].slug).to.equal('angularjs')
      GET '/tags/search?q=angular-js', {}, (s3) ->
        expect(s3[0].slug).to.equal('angularjs')
        GET '/tags/search?q=angular js', {}, (s4) ->
          expect(s4[0].slug).to.equal('angularjs')
          # GET '/tags/search/angular 1.2', {}, (s5) ->
          #   $log('s5', s5)
          #   expect(s5[0].slug).to.equal('angularjs-1.2')
          #   GET '/tags/search/angular-1.2', {}, (s6) ->
          #     expect(s6[0].slug).to.equal('angularjs-1.2')
          DONE()


IT '"ruby on rails" (spaces, no capital letters)', ->
  GET '/tags/search?q=ruby on rails', {}, (s1) ->
    expect(s1[0].slug).to.equal('ruby-on-rails')
    GET '/tags/search?q=RoR', {}, (s2) ->
      expect(s2[0].slug).to.equal('ruby-on-rails')
      GET '/tags/search?q=rrr', {}, (s3) ->
        expect(s3[0].slug).to.equal('ruby-on-rails')
        GET '/tags/search?q=ruby-on-rails', {}, (s4) ->
          # expect(s4[0].slug).to.equal('ruby-on-rails')
          GET '/tags/search?q=rails', {}, (s5) ->
            expect(s5[0].slug).to.equal('ruby-on-rails')
            GET '/tags/search?q=ruby', {}, (s6) ->
              expect(s6[0].slug).to.equal('ruby')
              DONE()


DESCRIBE "301 Shady Support old url format (limited)", ->

  IT.skip '"mon"', ->
    # GET '/tags/search/mon', RES(301,/text/), (t) ->
    #   expect(t).to.inc ' /v1/api/tags/search?q=mon'
    #   GET '/tags/search?q=mon', {}, (s) ->
    #     expect(s.length).to.equal(3)
    #     expect(s[2].name).to.equal('MongoDB')
    #     DONE()


  IT.skip '"ios"', ->
    # GET '/tags/search/ios', RES(301,/text/), (t) ->
    #   expect(t).to.inc ' /v1/api/tags/search?q=ios'
    #   # expect(s1.length).to.equal(4)
    #   # expect(s1[0].name).to.equal('iOS')
    #   DONE()
