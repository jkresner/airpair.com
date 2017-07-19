LIBRARY = (s, {drafts,inreview,published,forked,reviewed}, cb) ->
  PAGE "/author", {}, (html) ->
    expect(html).to.inc ["window.pageData = { session: {\"_id\":\"#{s._id}\",\"name\":\"#{s.name}\""]
    GET "/me/home", (lib) ->
      expect(lib.user._id).eqId(s._id)
      expect(lib.drafts.length, 'drafts').to.equal(drafts||0)
      expect(lib.inreview.length, 'inreview').to.equal(inreview||0)
      expect(lib.published.length, 'published').to.equal(published||0)
      expect(lib.mine.length, 'mine').to.equal(drafts||0+inreview||0+published||0)
      # expect(lib.feedback.length).to.exist
      # expect(lib.forked).to.equal(forked||0)
      # expect(lib.reviewed).to.equal(reviewed||0)
      cb lib


IT 'From airpair.com to submit first post', ->
  title = "My first flow post #{@testSeed}"
  STORY.newAuthor 'tst1', { ghKey: 'author1', login: true }, (s) =>
    LIBRARY s, {}, (lib0) =>
      expect(lib0.mine.length).to.equal(0)
      PAGE "/author/new", {}, (html1) =>
        expect(html1).inc "window.pageData = { session: {\"_id\":\"#{s._id}\",\"name\":\"#{s.name}\""
        POST "/author/post", {title,type:'tutorial'}, (p0) =>
          PAGE "/author/editor/#{p0._id}", {}, (html2) =>
            GET "/author/markdown/#{p0._id}", (p1Edit) =>
              expect(p1Edit.md.live).to.equal('new')
              PUT "/author/markdown/#{p0._id}", {md:"## First post heading\n\n#{DATA.lotsOfWords()}"}, (p2Edit) =>
                LIBRARY s, {drafts:1}, (lib1) =>
                  PAGE "/author/post-info/#{p0._id}", {}, (html3) =>
                    GET "/author/info/#{p0._id}", p0, (p2details) =>
                      p2details.tags = [{ "_id" : "5181d0a966a6f999a465ec0a"}]
                      p2details.assetUrl = 'https://imgur.com/flo123.png'
                      PUT "/author/info/#{p0._id}", p2details, (p3) =>
                        # PAGE "/preview/#{p0._id}", {}, (html4) ->
                        PAGE "/author/submit/#{p0._id}", {}, (html5) =>
                          GET "/author/submitting/#{p0._id}", p0, (p3submission) =>
                            expect(p3submission.submission.valid).to.be.true
                            PUT "/author/submit/#{p0._id}", {slug:p3submission.slug}, (p4) =>
                              expect(p4.history.submitted).to.exist
                              LIBRARY s, {inreview:1}, (lib2) =>
                                DONE()

