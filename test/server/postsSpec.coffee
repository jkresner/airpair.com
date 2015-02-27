
module.exports = -> describe  "API: ", ->

  before (done) ->
    SETUP.analytics.stub()
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


  it.only "Edit and delete draft post as author", (done) ->
