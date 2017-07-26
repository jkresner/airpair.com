creating = ->


  IT "Fails for anonymous user", ->
    title = "Post Anon Create Test #{@testSeed}"
    POST "/author/post", {title}, { authenticated: false, status: 403 }, (e) ->
      DONE()


  IT "Fails without title", ->
    STORY.newAuthor 'jkx', (s) ->
      POST "/author/post", {}, { status: 403 }, (err) ->
        expect(err.message).to.inc ["Title required"]
        DONE()


  IT "Create with title", ->
    title = "Post Create with no social Test #{@testSeed}"
    STORY.newAuthor 'tbau', (s) =>
      POST "/author/post", { title, type: 'tutorial' }, (p0) =>
        EXPECT.equalIds(p0.by._id, s._id)
        expect(p0.by.name).to.equal(s.name)
        expect(p0.by.bio).to.inc ['Member of Thiel Foundation Summi']
        expect(p0.by.avatar).to.equal("https://avatars.githubusercontent.com/u/11258947")
        expect(p0.assetUrl).to.be.undefined
        expect(p0.title).to.equal(title)
        expect(p0.type).to.equal('tutorial')
        # expect(p0.md).to.be.undefined
        expect(p0.md).to.be.undefined
        expect(p0.tags.length).to.equal(0)
        expect(p0.published).to.be.undefined
        expect(p0.history).to.exist
        expect(p0.history.created).to.exist
        expect(p0.history.published).to.be.undefined
        # expect(p0.meta).to.be.undefined
        expect(p0.meta).to.exist
        expect(p0.meta.activity).to.be.undefined
        expect(p0.meta.lastTouch).to.exist
        DB.docById 'Post', p0._id, (p0DB) =>
          expect(p0DB.md).to.equal('new')
          expect(p0DB.meta).to.exist
          expect(p0DB.meta.activity.length).to.equal(1)
          DONE()


deleting = ->


  IT "Delete as author", ->
    title = "Post delete as author #{@testSeed}"
    STORY.newAuthor 'jkg', (s) ->
      POST "/author/post", { title, type: 'docs' }, (p0) ->
        expect(p0._id).to.exist
        DB.docById 'Post', p0._id, (p0DB) ->
          expect(p0DB).to.exist
          DELETE "/author/post/#{p0._id}", (resp) ->
            DB.docById 'Post', p0._id, (pDB) ->
              expect(pDB).to.be.null
              DONE()


  IT "Delete as editor", ->
    title = "Post delete as non-author #{@testSeed}"
    STORY.newAuthor 'tst8', (s) ->
      POST "/author/post", { title, type: 'guide' }, (p0) ->
        expect(p0._id).to.exist
        DB.docById 'Post', p0._id, (p0DB) ->
          expect(p0DB).to.exist
          LOGIN 'tiag', { retainSession:false }, (stiag) ->
            expect(s._id.toString()).not.equal(stiag._id.toString())
            DELETE "/author/post/#{p0._id}", (resp) ->
              DB.docById 'Post', p0._id, (pDB) ->
                expect(pDB).to.be.null
                DONE()


  IT "Fails as non author (or editor)", ->
    title = "Post delete as non-author or editor #{@testSeed}"
    STORY.newAuthor 'jky', (s) =>
      POST "/author/post", { title, type: 'review' }, (p0) =>
        DB.docById 'Post', p0._id, (p0DB) =>
          expect(p0DB).to.exist
          STORY.newAuthor 'tbel', (stbel) =>
            expect(s._id.toString()).not.equal(stbel._id.toString())
            DELETE "/author/post/#{p0._id}", { status: 403 }, (err) =>
              DB.docById 'Post', p0._id, (pDB) =>
                expect(pDB).to.exist
                DONE()


editing = ->


  SKIP "Edit and preview as author", ->
    title = "Post edit and preview in draft Test #{@testSeed}"
    STORY.newAuthor 'stpv', (s) ->
      POST "/author/post", {title, type: 'guide'}, (p0) =>
        expect(p0.reviews).to.be.undefined
        expect(p0.md).to.be.undefined
        expect(p0.slug).to.be.undefined
        expect(p0.history).to.exist
        DB.docById 'Post', p0._id, (p0DB) =>
          EXPECT.equalIdAttrs(p0, p0DB)
          expect(p0DB.md).to.equal('new')
          expect(p0DB.slug).to.be.undefined
          expect(p0DB.url).to.be.undefined
          expect(p0DB.reviews.length).to.equal(0)
          expect(p0DB.forkers.length).to.equal(0)
          expect(p0DB.stats).to.be.undefined
          expect(p0DB.history.created).to.exist
          expect(p0DB.history.submitted).to.be.undefined
          GET "/author/markdown/#{p0._id}", (p0Edit) =>
            expect(p0Edit.md.live).to.equal('new')
            # expect(p0Edit.md.head).to.be.undefined
            expect(p0Edit.md.head).to.equal('new')
            expect(p0Edit.post.url).to.be.undefined
            expect(p0Edit.post.stats).to.exist
            expect(p0Edit.post.stats.words).to.equal(1)
            expect(p0Edit.post.stats.reviews).to.be.undefined
            updatedMD = '## updated md heading\n\nTest pargraph <sup>this is a reference</sup>'
            PUT "/author/markdown/#{p0._id}", { md: updatedMD }, (p1Edit) =>
              expect(p1Edit.md.live).to.equal(updatedMD)
              DB.docById 'Post', p0._id, (p1DB) =>
                expect(p1DB.md).to.equal(updatedMD)
                GET "/author/preview/#{p0._id}", { status: 403 }, (err) =>
                  expect(err.message).to.inc ['must have tags']
                  p0.tags = [{"_id" : ObjectId("514825fa2a26ea020000001f")}]
                  p0.assetUrl = 'https://imgur.com/asdf2asd.png'
                  PUT "/author/info/#{p0._id}", p0, (p2) =>
                    expect(p2.body).to.be.undefined
                    GET "/author/preview/#{p0._id}", (p2preview) =>
                      EXPECT.equalIdAttrs(p2preview, p0)
                      expect(p2preview.md).to.be.undefined
                      # expect(p2preview.references[1]).to.equal('this is a reference')
                      expect(p2preview.references[0]).to.inc('this is a reference')
                      expect(p2preview.body).to.exist
                      expect(p2preview.body).to.inc ['<h2 id=\"updated-md-heading\">updated md heading</h2>']
                      expect(p2preview.toc).to.inc ['updated md heading</a></li>']
                      DONE()


  SKIP 'Fail preview + edit as non-author and editor', ->


updating = ->


  IT "Fails tags update as non-author (and editor)", ->
    {title, tags} = FIXTURE.clone('posts.exps_deep',{pick:'title tags'})
    LOGIN 'jkg', (sJk) ->
      POST "/author/post", { title, type: 'tutorial' }, (p0) ->
        expect(p0._id).to.exist
        expect(p0.tags.length).to.equal(0)
        expect(p0.by._id).to.exist
        STORY.newAuthor 'tst5', (s) ->
          expect(s._id.toString()).not.equal(p0.by._id.toString())
          GET "/author/info/#{p0._id}", { status: 403 }, (e0) ->
            expect(e0.message).to.inc ['Update by owner only']
            p0.tags = tags
            expect(p0.tags.length).to.equal(2)
            PUT "/author/info/#{p0._id}", p0, { status: 403 }, (e1) ->
              expect(e1.message).to.inc ['Updated by owner only']
              # STORY.newEditor 'tst8', (s) ->
              # PUT "/post/info/#{p0._id}", p0, { status: 403 }, (e1) ->
                # expect(e1.message).to.equal('Post[draft] must be updated by owner')
              DONE()


  IT "Update title and tags as author", ->
    {title, tags} = FIXTURE.clone('posts.exps_deep',{pick:'title tags'})
    LOGIN 'jkg', (sJk) =>
      POST "/author/post", { title, type: 'tutorial' }, (p0) =>
        expect(p0._id).bsonIdStr()
        expect(p0.type).to.equal('tutorial')
        expect(p0.tags.length).to.equal(0)
        expect(p0.by._id).to.exist
        GET "/author/info/#{p0._id}", (p1) =>
          expect(p1._id).to.exist
          expect(p1.title).to.equal(title)
          expect(p1.tags.length).to.equal(0)
          expect(p1.by).eqId(sJk)
          p1.type = 'docs'
          p1.tags = tags
          p1.assetUrl = 'https://imgur.com/as1121sd.png'
          expect(p1.tags.length).to.equal(2)
          expect(p1.tags[0].name).to.equal('ExpressJS')
          expect(p1.tags[0].slug).to.equal('express')
          expect(p1.tags[0].sort).to.be.undefined
          expect(p1.tags[1].sort).to.be.undefined
          PUT "/author/info/#{p0._id}", p1, (p2) =>
            expect(p2.title).to.equal(title)
            expect(p2.type).to.equal('docs')
            expect(p2.tags.length).to.equal(2)
            expect(p2.tags[0].name).to.equal('ExpressJS')
            expect(p2.tags[0].slug).to.equal('express')
            expect(p2.tags[0].sort).to.equal(0)
            expect(p2.tags[1].sort).to.equal(1)
            updatedTitle = "updated test title #{@testSeed}"
            p2.title = updatedTitle
            PUT "/author/info/#{p0._id}", p2, (p3) =>
              expect(p3.title).to.equal(updatedTitle)
              expect(p2.tags.length).to.equal(2)
              DB.docById 'Post', p0._id, (p3DB) =>
                {activity} = p3DB.meta
                expect(activity.length).to.equal(3)
                expect(activity[0].action).to.equal('create')
                expect(activity[1].action).to.equal('updateInfo')
                expect(activity[2].action).to.equal('updateInfo')
                DONE()


  IT "Fail update removing all tags", ->
    {title, tags} = FIXTURE.clone('posts.exps_deep',{pick:'title tags'})
    LOGIN 'jkg', (sJk) ->
      POST "/author/post", { title, type: 'docs' }, (p0) =>
        expect(p0.tags.length).to.equal(0)
        GET "/author/info/#{p0._id}", (p1) =>
          p1.assetUrl = 'https://imgur.com/faz21sd.png'
          PUT "/author/info/#{p0._id}", assign(p1, {tags}), (p2) =>
            expect(p2.title).to.equal(title)
            expect(p2.tags.length).to.equal(2)
            p2.title = "updated test tags #{@testSeed}"
            p2.tags = []
            PUT "/author/info/#{p0._id}", p2, { status: 403 }, (e3) =>
              expect(e3.message).to.inc [" at least 1 tag"]
              DB.docById 'Post', p0._id, (p3DB) =>
                expect(p3DB.tags.length).to.equal(2)
                DONE()


  IT "Fail non https imgur assetUrl value", ->
    {title, tags} = FIXTURE.clone('posts.higherOrder',{pick:'title tags'})
    LOGIN 'jkg', (sJk) ->
      POST "/author/post", { title, type: 'docs' }, (p0) ->
        p0.tags = tags
        p0.assetUrl = 'http://imgur.com/abvcsde.png'
        PUT "/author/info/#{p0._id}", p0, { status: 403 }, (e3) ->
          expect(e3.message).to.inc ["ImgurId required for AssetUrls"]
          DONE()




DESCRIBE("Create", creating)
DESCRIBE("Delete", deleting)
DESCRIBE("Edit (Markdown)", editing)
DESCRIBE("Update (Details)", updating)




