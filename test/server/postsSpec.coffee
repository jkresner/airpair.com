dataHlpr = require('./setup/data')
PostsSvc = require('./../../server/services/posts')
PostsUtil = require('./../../shared/posts')



authoring = ->

  it.skip "Can split line over chacter limit", ->
    lines = ['### 2.1 When (Developer) Ideas Have Sex', '', '[![Matt Ridley](//airpair.github.io/img/2015/01/ma…alks/matt_ridley_when_ideas_have_sex?language=en)', '> ***"To answer our continual ability to attain mo…ne and recombine, to meet and indeed to mate."***']
    r = PostsUtil.splitLines(lines, 74)
    expect(r.length).to.equal(6)


  it "Cannot create post as anonymous user", itDone ->
    title = "Post Anon Create Test #{timeSeed()}"
    ANONSESSION (s) ->
      POST "/posts", {title, by: _.extend({bio:'yo'},data.users['jk']) }, { status: 401 }, (r) ->
        DONE()


  it "Create post as signed in user with no social detail", itDone ->
    title = "Post Create with no social Test #{timeSeed()}"
    SETUP.addAndLoginLocalUser 'prat', (s) ->
      d = { title, by: _.extend({bio: 'yo yyoy o'},s) }
      POST "/posts", d, {}, (post) ->
        expect(post.by.userId).to.equal(s._id)
        expect(post.by.name).to.equal(s.name)
        expect(post.by.bio).to.equal('yo yyoy o')
        expect(post.by.avatar).to.equal(s.avatar)
        expect(post.created).to.exist
        expect(post.published).to.be.undefined
        expect(post.assetUrl).to.be.undefined
        expect(post.title).to.equal(d.title)
        expect(post.md).to.be.undefined
        expect(post.tags.length).to.equal(0)
        DONE()


  it 'Create post with max social', itDone ->
    title = "Post Create with max social Test #{timeSeed()}"
    SETUP.addAndLoginLocalUser 'ajde', (s) ->
      author = _.extend({bio: 'yes test'},s)
      author.username = 'ajayD'
      author.social =
        tw: { username: 'ajaytw' },
        gh: { username: 'ajaygh' },
        in: { id: 'ajayin' },
        so: { link: 'ajay/1231so' },
        gp: { link: 'ajaygp' }

      d = { title, by: author }
      POST "/posts", d, {}, (post) ->
        expect(post.by.userId).to.equal(s._id)
        expect(post.by.name).to.equal(s.name)
        expect(post.by.bio).to.equal('yes test')
        expect(post.by.avatar).to.equal(s.avatar)
        expect(post.by.username).to.equal('ajayd')
        expect(post.by.social.tw.username).to.equal('ajaytw')
        expect(post.by.social.gh.username).to.equal('ajaygh')
        expect(post.by.social.in.id).to.equal('ajayin')
        expect(post.by.social.so.link).to.equal('ajay/1231so')
        expect(post.by.social.gp.link).to.equal('ajaygp')
        expect(post.created).to.exist
        expect(post.submitted).to.be.undefined
        expect(post.published).to.be.undefined
        expect(post.assetUrl).to.equal(d.assetUrl)
        expect(post.title).to.equal(d.title)
        expect(post.md).to.be.undefined
        expect(post.tags.length).to.equal(0)
        DONE()


  it "Edit and delete draft post as author", itDone ->
    title = "Post Edit and delete in draft Test #{timeSeed()}"
    SETUP.addAndLoginLocalUser 'stpv', (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s) }
      POST "/posts", d, {}, (p0) ->
        expect(p0.slug).to.be.undefined
        expect(p0.reviews).to.be.undefined
        expect(p0.lastTouch).to.be.undefined
        GET "/posts/#{p0._id}/edit", {}, (pEdit) ->
          expect(pEdit.md).to.equal('new')
          # expect(pEdit.stats.reviews).to.equal(0)
          PUT "/posts/#{p0._id}/md", { md: 'updated md' }, {}, (p1) ->
            expect(p1.md, "updated md")
            GET "/posts/#{p0._id}/info", {}, (pInfo) ->
              expect(pInfo.slug).to.be.undefined
              expect(pInfo.reviews).to.be.undefined
              expect(pInfo.lastTouch).to.be.undefined
              expect(pInfo.md).to.be.undefined
              expect(pInfo.title).to.equal(title)
              pInfo.title = "Updated " + title
              PUT "/posts/#{p0._id}", pInfo, {}, (p2) ->
                expect(p2.title).to.equal(pInfo.title)
                DELETE "/posts/#{p0._id}", { status: 200 }, (r) ->
                  GET '/posts/me', {}, (posts) ->
                    myposts = _.where(posts,(p)->_.idsEqual(p.by.userId,s._id))
                    expect(myposts.length).to.equal(0)
                    DONE()


  it 'Edit and delete post as editor', itDone ->
    title = "Post Edit and delete in draft as Editor Test #{timeSeed()}"
    SETUP.addAndLoginLocalUser 'stpu', (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s) }
      POST "/posts", d, {}, (p0) ->
        LOGIN 'edap', ->
          GET "/posts/#{p0._id}/info", {}, (p1) ->
            p1.title = 'edd ' + p1.title
            p1.assetUrl = 'https://edited.com/test'
            PUT "/posts/#{p0._id}", p1, {}, (p2) ->
              expect(p2.title).to.equal(p1.title)
              expect(p2.assetUrl).to.equal('https://edited.com/test')
              DELETE "/posts/#{p0._id}", { status: 200 }, (r) ->
                LOGIN s.userKey, (s2) ->
                  expectIdsEqual(s._id, s2._id)
                  GET '/posts/me', {}, (posts) ->
                    myposts = _.where(posts,(p)->_.idsEqual(p.by.userId,s._id))
                    expect(myposts.length).to.equal(0)
                    DONE()


  it "Cant edit or delete draft post as non-author/editor", itDone ->
    title = "Post Can't Edit and delete as non-author #{timeSeed()}"
    SETUP.addAndLoginLocalUser 'evnr', (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s) }
      POST "/posts", d, {}, (p0) ->
        SETUP.addAndLoginLocalUser 'nevk', (s2) ->
          PUT "/posts/#{p0._id}", { title: 'updated title' }, { status: 403 }, (e1) ->
            expect(e1.message).to.equal('Post must be updated by owner')
            PUT "/posts/#{p0._id}/md", { md: 'updated md' }, { status: 403 }, (e2) ->
              expectStartsWith(e2.message, 'Cannot update markdown of draft post')
              DELETE "/posts/#{p0._id}", { status: 403 }, (e3) ->
                expect(e3.message).to.equal('Post must be deleted by owner')
                DONE()


  it "Submit for review fails without an authenticated GitHub account", itDone ->
    title = "Submit fails without connected github #{timeSeed()}"
    SETUP.addAndLoginLocalUser 'robot1', (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Submit without github') }
      SETUP.createSubmitReadyPost s.userKey, d, (post) ->
        GET "/posts/#{post._id}/submit", {}, (pCheckSubmit) ->
          expect(pCheckSubmit.submit.repoAuthorized).to.be.false
          PUT "/posts/submit/#{post._id}", {slug:pCheckSubmit.slug}, {status: 403}, (resp) ->
            expect(resp.message).to.equal("User must authorize GitHub to submit post for review")
            DONE()


  it "Submit for review creates a repo with a README.md and a post.md file on edit branch", itDone ->
    title = "Submit success with connected github #{timeSeed()}"
    SETUP.addAndLoginLocalUserWithGithubProfile 'robot2', null, (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Submit with github') }
      SETUP.createSubmitReadyPost s.userKey, d, (post) ->
        expect(post.github).to.be.undefined
        GET "/posts/#{post._id}/submit", {}, (pCheckSubmit) ->
          expect(pCheckSubmit.submit.repoAuthorized).to.be.true
          PUT "/posts/submit/#{post._id}", {slug:pCheckSubmit.slug}, {}, (p1) ->
            expect(p1.github).to.exist
            DONE()


  it "Cannot submit a post more than once for review"


  it "Can edit and preview post in review as author", itDone ->
    author = data.users.submPostAuthor
    db.ensureDoc 'User', author, ->
      db.ensurePost data.posts.submittedWithGitRepo, ->
        LOGIN 'submPostAuthor', (s) ->
          GET "/posts/me", {}, (posts) ->
            myposts = _.where(posts,(p)=>_.idsEqual(p.by.userId,s._id))
            expect(myposts.length).to.equal(1)
            _id = myposts[0]._id
            getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:author})
            getForPreviewFn = $callSvc(PostsSvc.getByIdForPreview,{user:author})
            getForReviewFn _id, (e, pReview) ->
              reviewMD = pReview.md
              expect(reviewMD).to.equal(data.posts.submittedWithGitRepo.md)
              GET "/posts/#{_id}/edit", {}, (pEdit) ->
                md = "1"+pEdit.md
                PUT "/posts/#{_id}/md", { md, commitMessage: timeSeed() }, {}, (p2) ->
                  expect(p2.md).to.equal(md)
                  getForPreviewFn _id, (eee, pPreview2) ->
                    expect(pPreview2.md).to.equal(md)
                    getForReviewFn _id, (ee, pReview2) ->
                      expect(pReview2.md).to.equal(reviewMD)
                      DONE()


  it "Can sync github to post as author in review", itDone ->
    title = "Submit success with connected github #{timeSeed()}"
    SETUP.addAndLoginLocalUserWithGithubProfile 'robot6', null, (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Sync from with github') }
      SETUP.createSubmitReadyPost s.userKey, d, (post) ->
        _id = post._id
        slug = title.toLowerCase().replace(/\ /g, '-')
        PUT "/posts/submit/#{_id}", {slug}, {}, (p1) ->
          liveMD = p1.md
          md = "2"+liveMD
          PUT "/posts/#{_id}/md", { md, commitMessage: timeSeed() }, {}, (p2) ->
            getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:data.users[s.userKey]})
            getForReviewFn _id, (e, pReview) ->
              expect(pReview.md).to.equal(liveMD)
              expect(pReview.md).to.not.equal(md)
              PUT "/posts/propagate-head/#{_id}", {}, {}, (p3) ->
                expect(p3.md).to.equal(md)
                getForReviewFn _id, (ee, pReview2) ->
                  expect(pReview2.md).to.equal(md)
                  DONE()



  it "Can sync github to post as editor but not author when published", itDone ->
    author = data.users.syncPostAuthor
    db.ensureDoc 'User', author, ->
      db.ensurePost data.posts.toSync, ->
        LOGIN 'syncPostAuthor',  (s) ->
          _id = data.posts.toSync._id
          GET "/posts/#{_id}/edit", {}, (pEdit) ->
            md = "3 "+ data.posts.toSync.md
            PUT "/posts/#{_id}/md", { md, commitMessage: timeSeed() }, {}, (p2) ->
              expect(p2.md).to.equal(md)
              getForPublishedFn = $callSvc(PostsSvc.getBySlugForPublishedView,{user:data.users.syncPostAuthor})
              LOGIN 'edap', ->
                meta = dataHlpr.postMeta(p2)
                PUT "/posts/publish/#{_id}", {by:p2.by, meta, tmpl: 'default'}, {}, (p3) ->
                  getForPublishedFn p2.slug, (e, pPub1) ->
                    expect(pPub1.md).to.equal(data.posts.toSync.md)
                    PUT "/posts/propagate-head/#{_id}", {}, {}, (p4) ->
                      expect(p4.md).to.equal(md)
                      getForPublishedFn p2.slug, (ee, pPub2) ->
                        expect(pPub2.md).to.equal(md)
                        DONE()


  it "Can publish as admin without reviews", itDone ->
    title = "Can publish without reviews as admin #{timeSeed()}"
    slug = title.toLowerCase().replace(/\ /g, '-')
    SETUP.addAndLoginLocalUser 'obie',  (s) ->
      author = _.extend(s, {bio: "yhoyo", userId: s._id })
      post = _.extend({},data.posts.submittedWithGitRepo)
      post = _.extend(post, {title,slug,_id:newId(),by:author})
      meta = dataHlpr.postMeta(post)
      db.ensurePost post, ->
        LOGIN 'edap', ->
          PUT "/posts/publish/#{post._id}", {by:post.by, meta, tmpl: 'default'}, {}, (p2) ->
            expect(p2.published)
            expectIdsEqual(p2.publishedBy._id,data.users['edap']._id)
            DONE()


  it "Cannot publish as author without reviews", itDone ->
    title = "Cannot publish without reviews #{timeSeed()}"
    slug = title.toLowerCase().replace(/\ /g, '-')
    SETUP.addAndLoginLocalUser 'rapo',  (s) ->
      author = _.extend({bio: "yhoyo", userId: s._id }, s)
      post = _.extend({},data.posts.submittedWithGitRepo)
      post = _.extend(post, {title,slug,_id:newId(),by:author})
      meta = dataHlpr.postMeta(post)
      db.ensurePost post, ->
        PUT "/posts/publish/#{post._id}", {meta}, { status: 403 }, (e1) ->
          expect(e1.message).to.equal('Must have at least 3 reviews to be published')
          DONE()


browsing = ->


  it '200 on unauthenticated Posts by tag', itDone ->
    opts = status: 200, unauthenticated: true
    GET("/posts/tagged/python", opts, -> DONE() )


  it "Request post by non-existing slug", itDone ->
    GETP("/ionic-framework/posts/the-definitive-ionic-starter-gu")
      .expect('Content-Type', /text/)
      .expect(404)
      .end (e, resp) =>
        DONE(e)


  it "Get my posts does not contain any sensitive data", itDone ->
    LOGIN 'jkap', (jk) ->
      GET "/posts/me", {}, (myposts) ->
        for p in myposts
          expect(p.title).to.exist
          expect(p.publishHistory).to.be.undefined
          expect(p.editHistory).to.be.undefined
          if (p.github)
            expect(p.github.stats).to.be.undefined
            expect(p.github.events).to.be.undefined
          for f in p.forkers
            expect(f.email).to.be.undefined
          for r in p.reviews
            expect(r.by.email).to.be.undefined
            for v in r.votes
              expect(v.by.email).to.be.undefined
            for rp in r.replies
              expect(rp.by.email).to.be.undefined
        DONE()


  it "Redirect on review link for published post", itDone ->
    author = data.users.submPostAuthor
    db.ensureDocs 'Post', [data.posts.pubedArchitec], ->
      ANONSESSION (anon) ->
        GETP("/posts/review/#{data.posts.pubedArchitec._id}")
          .expect(301)
          .end (e, resp) ->
            expectStartsWith(resp.text, 'Moved Permanently. Redirecting to https://www.airpair.com/scalable-architecture-with-docker-consul-and-nginx')
            DONE()


contributing = ->

  it "Can fork, edit & preview post in review", itDone ->
    @timeout(14000)

    edit = (s, sRobot21, _id, liveMD) ->
      GET "/posts/#{_id}/edit", {}, (pForkEdit) ->
        # $log('going 3'.white)
        expect(pForkEdit.md).to.equal(liveMD)
        expect(pForkEdit.editHistory).to.be.undefined
        expect(pForkEdit.publishHistory).to.be.undefined
        expect(pForkEdit.forkers).to.be.undefined
        forkedMD = 'my fork ' + pForkEdit.md
        PUT "/posts/#{_id}/md", { md: forkedMD, commitMessage: timeSeed() }, {}, (pForkSaved) ->
          expect(pForkSaved.md).to.equal(forkedMD)
          getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:data.users[sRobot21.userKey]})
          getForPreviewFn = $callSvc(PostsSvc.getByIdForPreview,{user:data.users[sRobot21.userKey]})
          getForReviewFn _id, (e, pForkReview) ->
            expect(pForkReview.md).to.equal(liveMD)
            getForPreviewFn _id, (eee, pForkPreview) ->
              expect(pForkPreview.md).to.equal(forkedMD)
              LOGIN s.userKey, (sRobot4) ->
                GET "/posts/#{_id}/edit", {}, (pParentEdit) ->
                  expect(pParentEdit.md).to.equal(liveMD)
                  parentMD = 'my parent ' + pParentEdit.md
                  PUT "/posts/#{_id}/md", { md: parentMD, commitMessage: timeSeed() }, {}, (pParentSaved) ->
                    expect(pParentSaved.md).to.equal(parentMD)
                    getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:data.users[s.userKey]})
                    getForPreviewFn = $callSvc(PostsSvc.getByIdForPreview,{user:data.users[s.userKey]})
                    getForReviewFn _id, (e, pParentReview) ->
                      expect(pParentReview.md).to.equal(liveMD)
                      getForPreviewFn _id, (eee, pParentPreview) ->
                        expect(pParentPreview.md).to.equal(parentMD)
                        DONE()

    fork = (_id, done) ->
      SETUP.addAndLoginLocalUserWithGithubProfile 'robot21', data.users.apt5.social.gh, (sRobot21) ->
        GET "/posts/#{_id}/fork", {}, (pForFork) ->
          expectIdsEqual(pForFork._id, _id)
          expect(pForFork.submit.repoAuthorized).to.be.true
          expect(pForFork.editHistory).to.be.undefined
          expect(pForFork.publishHistory).to.be.undefined
          expect(pForFork.github).to.be.undefined
          expect(pForFork.reviews).to.be.undefined
          expect(pForFork.forkers).to.be.undefined
          PUT "/posts/add-forker/#{pForFork._id}", {}, {}, (p2) ->
            expect(p2.editHistory).to.be.undefined
            expect(p2.publishHistory).to.be.undefined
            # expect(p2.github.repoInfo).to.exist
            expect(p2.reviews.length).to.equal(0)
            expect(p2.forkers.length).to.equal(1)
            expectIdsEqual(p2.forkers[0].userId, sRobot21._id)
            expect(p2.forkers[0]._id).to.exist
            expect(p2.forkers[0]._id.toString()).to.not.equal(p2._id.toString())
            expect(p2.forkers[0].name).to.equal(sRobot21.name)
            expect(p2.forkers[0].email).to.be.undefined
            expect(p2.forkers[0].username).to.equals('airpairtest5')
            expect(p2.forkers[0].social).to.be.undefined
            GET "/posts/me", {}, (myposts) ->
              p3 = _.find(myposts,(p)->_.idsEqual(p._id,p2._id))
              expect(p3.editHistory).to.be.undefined
              expect(p3.publishHistory).to.be.undefined
              # expect(p3.github.repoInfo).to.exist
              expect(p3.github).to.be.undefined
              # expect(p3.github.events).to.be.undefined
              expect(p3.reviews.length).to.equal(0)
              expect(p3.forkers.length).to.equal(1)
              done(sRobot21)

    title = "Can fork edit and preview #{timeSeed()}"
    SETUP.addAndLoginLocalUserWithGithubProfile 'robot4', null, (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Can fork and stuffz ') }
      SETUP.createSubmitReadyPost s.userKey, d, (post) ->
        _id = post._id
        slug = title.toLowerCase().replace(/\ /g, '-')
        PUT "/posts/submit/#{_id}", { slug }, {}, (p1) ->
          getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:data.users[s.userKey]})
          getForReviewFn _id, (e, pReview) ->
            liveMD = pReview.md
            expect(liveMD).to.equal(d.md)
            fork _id, (sRobot21) ->
              go = () -> edit(s, sRobot21, _id, liveMD)
              setTimeout(go,500) # sometimes it breaks because github isn't finished


module.exports = ->

  @timeout(8000)

  before (done) ->
    if (config.auth.github.org == 'airpair')
      throw Error('Cant run post tests against prod github org')
    SETUP.addEditorUserWithGitHub 'edap', ->
    SETUP.addEditorUserWithGitHub 'jkap', ->
      done()


  describe.skip("Authoring: ".subspec, authoring)
  describe("Browsing: ".subspec, browsing)
  describe.skip("Contributing: ".subspec, contributing)

