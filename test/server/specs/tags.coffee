get = ->


  IT '401 on unauthenticated Tag.getById', ->
    opts = status: 401, unauthenticated: true
    GET("/adm/tags/5149dccb5fc6390200000013", opts, -> DONE() )


  IT 'getById returns all tag data for admin', ->
    LOGIN {key:'admin'}, ->
      GET "/adm/tags/5149dccb5fc6390200000013", (t) ->
        expectIdsEqual(t._id,"5149dccb5fc6390200000013")
        expect(t.name).to.equal('AngularJS')
        expect(t.short).to.equal('Angular')
        expect(t.slug).to.equal('angularjs')
        expectStartsWith(t.desc,"AngularJS is an open-source JavaScript framework.")
        expect(t.tokens).to.equal('ang,angular,angular.js,angular-js,angular js')
        expect(t.meta.title).to.equal("AngularJS Articles, Workshops & Developers ready to help. A top resource!")
        expect(t.meta.description).to.equal("AngularJS Articles, Workshops & Developers ready to help. One of the web's top AngularJS resources - totally worth bookmarking!")
        expect(t.meta.ogType).to.equal("website")
        expect(t.meta.ogTitle).to.equal("AngularJS Articles, Workshops and Developers")
        expect(t.meta.ogDescription).to.equal("One of the best collections of #AngularJS Articles, Live Workshops and Developers on the web")
        expect(t.meta.ogImage).to.equal( "https://www.airpair.com/static/img/css/tags/angularjs-og.png")
        expect(t.meta.ogUrl).to.equal("https://www.airpair.com/angularjs")
        expect(t.meta.canonical).to.equal("http://www.airpair.com/angularjs")
        expect(t.soId).to.equal('angularjs')
        expect(t.so).to.undefined
        expect(t.ghId).to.undefined
        expect(t.gh).to.undefined
        DONE()


  IT 'Search tags when anonymous', ->
    GET '/tags/search/mon', (s) ->
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
      expect(s[1].name).to.equal('mongoengine')
      expect(s[0].name).to.equal('mongoid')
      DONE()


  it.skip 'Search tags for ios', ->
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


  IT 'Search tags for c++', ->
    GET '/tags/search/c++', {}, (s1) ->
      expect(s1.length).to.equal(4)
      expect(s1[0].name).to.equal('c++')
      GET '/tags/search/c+', {}, (s2) ->
        expect(s2[0].name).to.equal('c++')
        DONE()


  IT 'Search tags for c#', ->
    GET '/tags/search/c%23', {}, (s) ->
      expect(s.length).to.equal(4)
      expect(s[0].name).to.equal('c#')
      expect(s[1].name).to.equal('c++')
      expect(s[2].name).to.equal('c#-4.0')
      expect(s[3].name).to.equal('c#-3.0')
      DONE()


  IT 'Search tags for android', ->
    GET '/tags/search/android', {}, (s1) ->
      expect(s1[0].slug).to.equal('android')
      GET '/tags/search/droid', {}, (s2) ->
        expect(s2[0].slug).to.equal('android')
        GET '/tags/search/android x86', {}, (s3) ->
          expect(s3[0].slug).to.equal('android-x86')
          DONE()


  IT 'Search tags for angularjs', ->
    GET '/tags/search/angularjs', {}, (s1) ->
      expect(s1[0].slug).to.equal('angularjs')
      GET '/tags/search/angular', {}, (s2) ->
        expect(s2[0].slug).to.equal('angularjs')
        GET '/tags/search/angular-js', {}, (s3) ->
          expect(s3[0].slug).to.equal('angularjs')
          GET '/tags/search/angular js', {}, (s4) ->
            expect(s4[0].slug).to.equal('angularjs')
            # GET '/tags/search/angular 1.2', {}, (s5) ->
            #   $log('s5', s5)
            #   expect(s5[0].slug).to.equal('angularjs-1.2')
            #   GET '/tags/search/angular-1.2', {}, (s6) ->
            #     expect(s6[0].slug).to.equal('angularjs-1.2')
            DONE()


  IT 'Search tags for ruby on rails', ->
    GET '/tags/search/ruby on rails', {}, (s1) ->
      expect(s1[0].slug).to.equal('ruby-on-rails')
      GET '/tags/search/RoR', {}, (s2) ->
        expect(s2[0].slug).to.equal('ruby-on-rails')
        GET '/tags/search/rrr', {}, (s3) ->
          expect(s3[0].slug).to.equal('ruby-on-rails')
          GET '/tags/search/ruby-on-rails', {}, (s4) ->
            expect(s4[0].slug).to.equal('ruby-on-rails')
            GET '/tags/search/rails', {}, (s5) ->
              expect(s5[0].slug).to.equal('ruby-on-rails')
              GET '/tags/search/ruby', {}, (s6) ->
                expect(s6[0].slug).to.equal('ruby')
                DONE()


create = ->

  before ->
    @soApiGetStub = STUB.stubWrapperAPICall 'StackExchange', 'get'
    @soResponseCB = (fixtureKey) ->
      (url, cb) -> cb null, ({ok:true,body:FIXTURE.wrappers[fixtureKey]})


  # IT '401 on Create from 3rd party term for anonymous', ->
  #   POST '/tags', { term: 'ember.js' }, { status: 401 }, ->
  #     DONE()

  IT 'Create by soId fails for invalid SO tag', ->
    @soApiGetStub @soResponseCB('stackoverflow_wiki_nofoundtag')
    LOGIN {key:'admin'}, =>
      POST '/tags', { tagfrom3rdparty: 'sdgvbffaddbsdf' }, { status: 404 }, (e) ->
        expectStartsWith(e.message, "tagfrom3rdparty not found")
        DONE()

  IT 'Create by soId for valid SO tag ios8', ->
    DB.removeDocs 'Tag', { slug: 'ios8' }, ->
    @soApiGetStub @soResponseCB('stackoverflow_wiki_ios8')
    LOGIN {key:'admin'}, ->
      POST '/tags', { tagfrom3rdparty: 'ios8' }, {}, (t) ->
        expect(t._id).to.exist
        expect(t.name).to.equal('ios8')
        expect(t.short).to.equal('ios8')
        expect(t.slug).to.equal('ios8')
        expectStartsWith(t.desc, "iOS 8 is the eighth version of Apple&#39;s iOS mobile operating system.")
        expect(t.tokens).to.be.undefined
        expect(t.soId).to.be.undefined
        expect(t.so).to.be.undefined
        expect(t.gh).to.be.undefined
        expect(t.ghId).to.be.undefined
        expect(t.meta).to.be.undefined
        GET "/adm/tags/#{t._id}", {}, (t2) ->
          expect(t2.name).to.equal('ios8')
          expect(t2.short).to.equal('ios8')
          expect(t2.slug).to.equal('ios8')
          expectStartsWith(t2.desc, "iOS 8 is the eighth version of Apple&#39;s iOS mobile operating system.")
          expect(t2.tokens).to.be.undefined
          expect(t2.soId).to.equal('ios8')
          expect(t2.so.tag_name).to.equal('ios8')
          expect(t2.gh).to.be.undefined
          expect(t2.ghId).to.be.undefined
          expect(t2.meta).to.be.undefined
          DONE()


  IT 'Create from 3rd party term matching existing soId updates data for existing tag', ->
    DB.ensureDocs 'Tag', [FIXTURE.tags['ember.js']], ->
    @soApiGetStub @soResponseCB('stackoverflow_wiki_ember')
    LOGIN {key:'admin'}, ->
      GET '/adm/tags/5181d0aa66a6f999a465eceb', {}, (emb1) ->
        expect(emb1.name).to.equal("EmberJS")
        expect(emb1.short).to.equal("Ember")
        expect(emb1.slug).to.equal("ember.js")
        expect(emb1.soId).to.equal("ember.js")
        expectStartsWith(emb1.desc,"Ember.js itsa an advanced front end MVC")
        expect(emb1.tokens).to.equal("ember,emberjs,emb")
        POST '/tags', { tagfrom3rdparty: 'ember.js' }, {}, (emb2) ->
          expectIdsEqual(emb1._id,emb2._id).to.exist
          expect(emb2.name).to.equal("EmberJS")
          expect(emb2.short).to.equal("Ember")
          expect(emb2.slug).to.equal("ember.js")
          expect(emb2.desc).to.exist
          expect(emb2.tokens).to.be.undefined
          expect(emb2.soId).to.be.undefined
          expect(emb2.so).to.be.undefined
          expect(emb2.gh).to.be.undefined
          expect(emb2.ghId).to.be.undefined
          expect(emb2.meta).to.be.undefined
          GET '/adm/tags/5181d0aa66a6f999a465eceb', {}, (emb3) ->
            expect(emb3.name).to.equal("EmberJS")
            expect(emb3.short).to.equal("Ember")
            expect(emb3.slug).to.equal("ember.js")
            expect(emb3.desc).to.exist
            expect(emb3.tokens).to.equal(emb1.tokens)
            expect(emb3.soId).to.equal(emb1.soId)
            expect(emb3.so.tag_name).to.equal("ember.js")
            expect(emb3.gh).to.be.undefined
            expect(emb3.ghId).to.be.undefined
            expect(emb3.meta).to.be.undefined
            DONE()

update = ->

  IT 'Cannot change slug update tag', ->
    LOGIN {key:'admin'}, ->
      GET '/adm/tags/514825fa2a26ea020000001b', {}, (t) ->
        expect(t.slug).to.equal("ios")
        t.slug = "appleos"
        PUT '/adm/tags/514825fa2a26ea020000001b', t, { status: 403 }, (err) ->
          expectStartsWith(err.message, "Cannot change tag slug")
          DONE()

  # IT 'Admin update tag with minimal meta', ->
  #   DB.ensureDocs 'Tag', [FIXTURE.tags.express], ->
  #   LOGIN {key:'admin'}, ->
  #     GET '/adm/tags/514825fa2a26ea0200000016', {}, (exp1) ->
  #       expect(exp1.name).to.equal("express")
  #       expect(exp1.short).to.equal("express")
  #       expect(exp1.slug).to.equal("express")
  #       expectStartsWith(exp1.desc,"Express is a minimalistic web application")
  #       expect(exp1.tokens).to.be.undefined
  #       expect(exp1.soId).to.equal("express")
  #       expect(exp1.so).to.be.undefined
  #       expect(exp1.gh).to.be.undefined
  #       expect(exp1.ghId).to.be.undefined
  #       expect(exp1.meta).to.be.undefined
  #       exp1.name = "ExpressJS"
  #       exp1.short = "Express"
  #       exp1.desc = "ExpressJS 4.0 is here!"
  #       exp1.tokens = "expr,express,express.js"
  #       exp1.meta =
  #         title: "ExpressJS Developers, Articles, Tutorials and more",
  #         description: "ExpressJS Express for NodeJS",
  #         canonical: "https://www.airpair.com/express"
  #       PUT "/adm/tags/#{exp1._id}", exp1, {}, (exp2) ->
  #         expect(exp2.name).to.equal("ExpressJS")
  #         expect(exp2.short).to.equal("Express")
  #         expect(exp2.slug).to.equal("express")
  #         expect(exp2.tokens).to.equal("expr,express,express.js")
  #         expect(exp2.soId).to.equal("express")
  #         expect(exp2.so).to.be.undefined
  #         expect(exp2.meta.title).to.equal("ExpressJS Developers, Articles, Tutorials and more")
  #         expect(exp2.meta.description).to.equal("ExpressJS Express for NodeJS")
  #         expect(exp2.meta.canonical).to.equal("https://www.airpair.com/express")
  #         expect(exp2.meta.ogType).to.equal("website")
  #         expect(exp2.meta.ogTitle).to.equal("ExpressJS Developers, Articles, Tutorials and more")
  #         expect(exp2.meta.ogDescription).to.equal("ExpressJS Express for NodeJS")
  #         expect(exp2.meta.ogImage).to.equal("https://www.airpair.com/static/img/css/tags/express-og.png")
  #         expect(exp2.meta.ogUrl).to.equal("https://www.airpair.com/express")
  #         expect(exp2.gh).to.be.undefined
  #         expect(exp2.ghId).to.be.undefined
  #         expectStartsWith(exp2.desc,"ExpressJS 4.0 is here!")
  #         DONE()


  # IT 'Admin update tag with verbose meta', ->
  #   DB.ensureDocs 'Tag', [FIXTURE.tags.express], ->
  #   LOGIN {key:'admin'}, ->
  #     GET '/adm/tags/514825fa2a26ea0200000016', {}, (exp1) ->
  #       exp1.meta =
  #         title: "ExpressJS Developers, Articles, Tutorials and more",
  #         description: "ExpressJS Express for NodeJS",
  #         canonical: "https://www.airpair.com/express"
  #         ogTitle: "2 ExpressJS Articles, Workshops and Developers",
  #         ogDescription: "2 One of the best collections of #Express People anywhere",
  #       PUT "/adm/tags/#{exp1._id}", exp1, {}, (exp2) ->
  #         expect(exp2.meta.title).to.equal("ExpressJS Developers, Articles, Tutorials and more")
  #         expect(exp2.meta.description).to.equal("ExpressJS Express for NodeJS")
  #         expect(exp2.meta.canonical).to.equal("https://www.airpair.com/express")
  #         expect(exp2.meta.ogTitle).to.equal("2 ExpressJS Articles, Workshops and Developers")
  #         expect(exp2.meta.ogDescription).to.equal("2 One of the best collections of #Express People anywhere")
  #         DONE()


module.exports = ->

  before (done) ->
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
      done()

  DESCRIBE("Get", get)
  DESCRIBE("Create", create)
  DESCRIBE("Update ", update)




