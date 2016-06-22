
before ->
  @SO_API = STUB.wrapper('StackExchange').api('get')
  # @soResponseCB = (fixtureKey) ->
    # (url, cb) -> cb null, ({ok:true,body:FIXTURE.wrappers[fixtureKey]})


# IT '401 on Create from 3rd party term for anonymous', ->
#   POST '/tags', { term: 'ember.js' }, { status: 401 }, ->
#     DONE()

IT 'Create by soId fails for invalid SO tag', ->
  @SO_API.fix('stackoverflow_wiki_nofoundtag')
  LOGIN {key:'admin'}, =>
    POST '/tags', { tagfrom3rdparty: 'sdgvbffaddbsdf' }, { status: 404 }, (e) ->
      expect(e.message.indexOf("tagfrom3rdparty not found")).to.equal(0)
      DONE()

IT 'Create by soId for valid SO tag ios8', ->
  DB.removeDocs 'Tag', { slug: 'ios8' }, ->
  @SO_API.fix('stackoverflow_wiki_ios8')
  LOGIN {key:'admin'}, ->
    POST '/tags', { tagfrom3rdparty: 'ios8' }, {}, (t) ->
      expect(t._id).to.exist
      expect(t.name).to.equal('ios8')
      expect(t.short).to.equal('ios8')
      expect(t.slug).to.equal('ios8')
      expect(t.desc).to.match(/iOS 8 is the eighth version of Apple&#39;s iOS mobile operating system/)
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
        expect(t2.desc).to.match(/iOS 8 is the eighth version of Apple&#39;s iOS mobile operating system/)
        expect(t2.tokens).to.be.undefined
        expect(t2.soId).to.equal('ios8')
        expect(t2.so.tag_name).to.equal('ios8')
        expect(t2.gh).to.be.undefined
        expect(t2.ghId).to.be.undefined
        expect(t2.meta).to.be.undefined
        DONE()


IT 'Create from 3rd party term matching existing soId updates data for existing tag', ->
  DB.ensureDocs 'Tag', [FIXTURE.tags['ember.js']], ->
  @SO_API.fix('stackoverflow_wiki_ember')
  LOGIN {key:'admin'}, ->
    GET '/adm/tags/5181d0aa66a6f999a465eceb', {}, (emb1) ->
      expect(emb1.name).to.equal("EmberJS")
      expect(emb1.short).to.equal("Ember")
      expect(emb1.slug).to.equal("ember.js")
      expect(emb1.soId).to.equal("ember.js")
      # EXPECT.startsWith(emb1.desc,"Ember.js itsa an advanced front end MVC")
      expect(emb1.tokens).to.equal("ember,emberjs,emb")
      POST '/tags', { tagfrom3rdparty: 'ember.js' }, {}, (emb2) ->
        EXPECT.equalIds(emb1._id,emb2._id).to.exist
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
