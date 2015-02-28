dataHlpr = require('./helpers/setup.data')
PostsSvc = require('./../../server/services/posts')

module.exports = -> describe "API: ", ->

  @timeout(8000)

  before (done) ->
    if (config.auth.github.org == 'airpair')
      throw Error('Cant run post tests against prod github org')
    SETUP.analytics.stub()
    SETUP.addUserWithRole 'edap', 'editor', ->
    SETUP.addUserWithRole 'jkap', 'editor', ->
      SETUP.initTags ->
        SETUP.initTemplates done

  after ->
    SETUP.analytics.restore()


  it.skip "UI handles anonymous reviews", (done)->



  it "Cannot create post as anonymous user", (done) ->
    title = "Post Anon Create Test #{timeSeed()}"
    ANONSESSION (s) ->
      POST "/posts", {title, by: _.extend({bio:'yo'},data.users['jk']) }, { status: 401 }, (r) ->
        done()


  it "Create post as signed in user with no social detail", (done) ->
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
        done()


  it 'Create post with max social', (done) ->
    title = "Post Create with max social Test #{timeSeed()}"
    addAndLoginLocalUser 'ajde', (s) ->
      author = _.extend({bio: 'yes test'},s)
      author.username = 'ajayD'
      author.social =
        tw: { username: 'ajaytw' },
        gh: { username: 'ajaygh' },
        in: { id: 'ajayin' },
        so: { link: 'ajay/1231so' },
        gp: { id: 'ajaygp' }

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
        expect(post.by.social.gp.id).to.equal('ajaygp')
        expect(post.created).to.exist
        expect(post.submitted).to.be.undefined
        expect(post.published).to.be.undefined
        expect(post.assetUrl).to.equal(d.assetUrl)
        expect(post.title).to.equal(d.title)
        expect(post.md).to.be.undefined
        expect(post.tags.length).to.equal(0)
        done()


  it "Edit and delete draft post as author", (done) ->
    title = "Post Edit and delete in draft Test #{timeSeed()}"
    SETUP.addAndLoginLocalUser 'stpv', (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s) }
      POST "/posts", d, {}, (p0) ->
        expect(p0.slug).to.be.undefined
        expect(p0.reviews).to.be.undefined
        expect(p0.lastTouch).to.be.undefined
        GET "/posts/#{p0._id}/edit", {}, (pEdit) ->
          expect(pEdit.md).to.equal('new')
          expect(pEdit.reviews.length).to.equal(0)
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
                    done()


  it 'Edit and delete post as editor', (done) ->
    title = "Post Edit and delete in draft as Editor Test #{timeSeed()}"
    SETUP.addAndLoginLocalUser 'stpu', (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s) }
      POST "/posts", d, {}, (p0) ->
        LOGIN 'edap', data.users['edap'], ->
          GET "/posts/#{p0._id}/info", {}, (p1) ->
            p1.title = 'edd ' + p1.title
            p1.assetUrl = 'https://edited.com/test'
            PUT "/posts/#{p0._id}", p1, {}, (p2) ->
              expect(p2.title).to.equal(p1.title)
              expect(p2.assetUrl).to.equal('https://edited.com/test')
              DELETE "/posts/#{p0._id}", { status: 200 }, (r) ->
                LOGIN s.userKey, data.users[s.userKey], (s2) ->
                  expectIdsEqual(s._id, s2._id)
                  GET '/posts/me', {}, (posts) ->
                    myposts = _.where(posts,(p)->_.idsEqual(p.by.userId,s._id))
                    expect(myposts.length).to.equal(0)
                    done()


  it "Cant edit or delete draft post as non-author/editor", (done) ->
    title = "Post Can't Edit and delete as non-author #{timeSeed()}"
    SETUP.addAndLoginLocalUser 'evnr', (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s) }
      POST "/posts", d, {}, (p0) ->
        addAndLoginLocalUser 'nevk', (s2) ->
          PUT "/posts/#{p0._id}", { title: 'updated title' }, { status: 403 }, (e1) ->
            expect(e1.message).to.equal('Post must be updated by owner')
            PUT "/posts/#{p0._id}/md", { md: 'updated md' }, { status: 403 }, (e2) ->
              expectStartsWith(e2.message, 'Cannot update markdown of draft post')
              DELETE "/posts/#{p0._id}", { status: 403 }, (e3) ->
                expect(e3.message).to.equal('Post must be deleted by owner')
                done()


  it "submit for review fails without an authenticated GitHub account", (done) ->
    title = "Submit fails without connected github #{timeSeed()}"
    addAndLoginLocalUser 'robot1', (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Submit without github') }
      SETUP.createSubmitReadyPost s.userKey, d, (post) ->
        slug = title.toLowerCase().replace(/\ /g, '-')
        PUT "/posts/submit/#{post._id}", {slug}, {status: 403}, (resp) ->
          expect(resp.message).to.equal("User must authorize GitHub to submit post for review")
          done()


  it "submit for review creates a repo with a README.md and a post.md file on edit branch", (done) ->
    title = "Submit success with connected github #{timeSeed()}"
    SETUP.addAndLoginLocalUserWithGithubProfile 'robot2', null, null, (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Submit with github') }
      SETUP.createSubmitReadyPost s.userKey, d, (post) ->
        expect(post.github).to.be.undefined
        slug = title.toLowerCase().replace(/\ /g, '-')
        PUT "/posts/submit/#{post._id}", {slug}, {}, (p1) ->
          expect(p1.github).to.exist
          done()


  it.skip "Cannot submit a post more than once for review", (done) ->


  it "Can edit and preview post in review as author", (done) ->
    author = data.users.submPostAuthor
    SETUP.ensureDoc 'User', author, ->
      SETUP.ensurePost data.posts.submittedWithGitRepo, ->
        LOGIN 'submPostAuthor', data.users.submPostAuthor, (s) ->
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
                      done()


  it "Can sync github to post as author in review", (done) ->
    title = "Submit success with connected github #{timeSeed()}"
    SETUP.addAndLoginLocalUserWithGithubProfile 'robot6', null, null, (s) ->
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
                  done()



  it "Can sync github to post as editor but not author when published", (done) ->
    author = data.users.syncPostAuthor
    SETUP.ensureDoc 'User', author, ->
      SETUP.ensurePost data.posts.toSync, ->
        LOGIN 'syncPostAuthor', data.users.syncPostAuthor, (s) ->
          _id = data.posts.toSync._id
          GET "/posts/#{_id}/edit", {}, (pEdit) ->
            md = "3 "+ data.posts.toSync.md
            PUT "/posts/#{_id}/md", { md, commitMessage: timeSeed() }, {}, (p2) ->
              expect(p2.md).to.equal(md)
              getForPublishedFn = $callSvc(PostsSvc.getBySlugForPublishedView,{user:data.users.syncPostAuthor})
              LOGIN 'edap', data.users['edap'], ->
                meta = dataHlpr.postMeta(p2)
                PUT "/posts/publish/#{_id}", {by:p2.by, meta, tmpl: 'default'}, {}, (p3) ->
                  getForPublishedFn p2.slug, (e, pPub1) ->
                    expect(pPub1.md).to.equal(data.posts.toSync.md)
                    PUT "/posts/propagate-head/#{_id}", {}, {}, (p4) ->
                      expect(p4.md).to.equal(md)
                      getForPublishedFn p2.slug, (ee, pPub2) ->
                        expect(pPub2.md).to.equal(md)
                        done()


  it "Can publish as admin without reviews", (done) ->
    title = "Can publish without reviews as admin #{timeSeed()}"
    slug = title.toLowerCase().replace(/\ /g, '-')
    addAndLoginLocalUser 'obie',  (s) ->
      author = _.extend(s, {bio: "yhoyo", userId: s._id })
      post = _.extend({},data.posts.submittedWithGitRepo)
      post = _.extend(post, {title,slug,_id:newId(),by:author})
      meta = dataHlpr.postMeta(post)
      SETUP.ensurePost post, ->
        LOGIN 'edap', data.users['edap'], ->
          PUT "/posts/publish/#{post._id}", {by:post.by, meta, tmpl: 'default'}, {}, (p2) ->
            expect(p2.published)
            expectIdsEqual(p2.publishedBy._id,data.users['edap']._id)
            done()


  it "Cannot publish as author without reviews", (done) ->
    title = "Cannot publish without reviews #{timeSeed()}"
    slug = title.toLowerCase().replace(/\ /g, '-')
    addAndLoginLocalUser 'rapo',  (s) ->
      author = _.extend({bio: "yhoyo", userId: s._id }, s)
      post = _.extend({},data.posts.submittedWithGitRepo)
      post = _.extend(post, {title,slug,_id:newId(),by:author})
      meta = dataHlpr.postMeta(post)
      SETUP.ensurePost post, ->
        PUT "/posts/publish/#{post._id}", {meta}, { status: 403 }, (e1) ->
          expect(e1.message).to.equal('Must have at least 3 reviews to be published')
          done()


  it "Can fork, edit & preview post in review", (done) ->
    @timeout(14000)
    title = "Can fork edit and preview #{timeSeed()}"
    SETUP.addAndLoginLocalUserWithGithubProfile 'robot4', null, null, (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Can fork and stuffz ') }
      SETUP.createSubmitReadyPost s.userKey, d, (post) ->
        _id = post._id
        slug = title.toLowerCase().replace(/\ /g, '-')
        PUT "/posts/submit/#{_id}", { slug }, {}, (p1) ->
          getForReviewFn = $callSvc(PostsSvc.getByIdForReview,{user:data.users[s.userKey]})
          getForReviewFn _id, (e, pReview) ->
            liveMD = pReview.md
            expect(liveMD).to.equal(d.md)
            SETUP.addAndLoginLocalUserWithGithubProfile 'robot21', 'airpairtester45', 'fd65392d8926f164755061e70a852d4ebe139e09', (sRobot21) ->
              GET "/posts/#{p1._id}/contributors", {}, (pForFork) ->
                expectIdsEqual(pForFork._id, _id)
                expect(pForFork.editHistory).to.be.undefined
                expect(pForFork.publishHistory).to.be.undefined
                expect(pForFork.github.repoInfo).to.exist
                expect(pForFork.reviews.length).to.equal(0)
                expect(pForFork.forkers.length).to.equal(0)
                PUT "/posts/add-forker/#{pForFork._id}", {}, {}, (p2) ->
                  expect(p2.editHistory).to.be.undefined
                  expect(p2.publishHistory).to.be.undefined
                  expect(p2.github.repoInfo).to.exist
                  expect(p2.reviews.length).to.equal(0)
                  expect(p2.forkers.length).to.equal(1)
                  expectIdsEqual(p2.forkers[0].userId, sRobot21._id)
                  expect(p2.forkers[0]._id).to.exist
                  expect(p2.forkers[0]._id.toString()).to.not.equal(p2._id.toString())
                  expect(p2.forkers[0].name).to.equal(sRobot21.name)
                  expect(p2.forkers[0].email).to.be.undefined
                  expect(p2.forkers[0].username).to.equals('airpairtester45')
                  expect(p2.forkers[0].social).to.be.undefined
                  GET "/posts/me", {}, (myposts) ->
                    p3 = _.find(myposts,(p)->_.idsEqual(p._id,p2._id))
                    expect(p3.editHistory).to.be.undefined
                    expect(p3.publishHistory).to.be.undefined
                    expect(p3.github.repoInfo).to.exist
                    expect(p3.github.stats).to.be.undefined
                    expect(p3.github.events).to.be.undefined
                    expect(p3.reviews.length).to.equal(0)
                    expect(p3.forkers.length).to.equal(1)
                    GET "/posts/#{p3._id}/edit", {}, (pForkEdit) ->
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
                            LOGIN s.userKey, data.users[s.userKey], (sRobot4) ->
                              GET "/posts/#{p3._id}/edit", {}, (pParentEdit) ->
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
                                      done()


  it "Get my posts does not contain any sensitive data", (done) ->
    LOGIN 'jkap', data.users.jkap, (jk) ->
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
        done()


