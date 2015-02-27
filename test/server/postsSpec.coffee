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
        PUT "/posts/submit/#{post._id}", post, {status: 403}, (resp) ->
          expect(resp.message).to.equal("User must authorize GitHub to submit post for review")
          done()


  it "submit for review creates a repo with a README.md and a post.md file on edit branch", (done) ->
    title = "Submit success with connected github #{timeSeed()}"
    SETUP.addAndLoginLocalUserWithGithubProfile 'robot2', null, null, (s) ->
      d = { title, by:_.extend({bio: 'yo yyoy o'},s), md: dataHlpr.lotsOfWords('Submit with github') }
      SETUP.createSubmitReadyPost s.userKey, d, (post) ->
        expect(post.github).to.be.undefined
        post.slug = title.toLowerCase().replace(/\ /g, '-')
        PUT "/posts/submit/#{post._id}", post, {}, (p1) ->
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




  it.skip "Can sync github to post as author in review", (done) ->


  it.skip "Can sync github to post as editor but not author when published", (done) ->


  it.skip "Can publish as admin without reviews", (done) ->


  it.skip "Cannot publish as author without reviews", (done) ->




