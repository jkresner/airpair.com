import {getHashId} from '../../server/services/postsToc'
var GitHubApi = require("github")
var githubApi = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  // debug: true,
  protocol: "https",
  timeout: 5000,
  headers: {
    "user-agent": "AirPair"
  }
});
var github = require("../../server/services/wrappers/github.js")

var lotsOfWords = ""
for (var i = 0; i < 501; i++){
  lotsOfWords += "stuff ";
}

var deleteRepo = function(owner, repo, token, cb){
  githubApi.authenticate({
    type:"oauth",
    token: token
  })
  githubApi.repos.delete({
    user: owner,
    repo: repo
  }, cb)
}

module.exports = () => describe("API: ", function() {

  this.timeout(30000)

  before(function(done) {
    SETUP.analytics.stub()
    SETUP.addUserWithRole('edap', 'editor', ()=>{})
    SETUP.initTags(() => {
      SETUP.initTemplates(done)
    })
  })

  after(function() {
    SETUP.analytics.restore()
  })

  beforeEach(function() {
    SETUP.clearIdentity()
  })

  it('401 on unauthenticated session for creating a post', function(done) {
    var opts = { status: 401, unauthenticated: true }
    var d = { title: "test", by: { bio: 'yoyo' } }
    POST('/posts', d, opts, function() { done() })
  })


  it('Create post as signed in user with minimal detail', function(done) {
    addAndLoginLocalUser('prat', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'yo yyoy o', avatar: s.avatar }
      var d = { title: "test", by: by, md: 'Test' }
      POST('/posts', d, {}, function(post) {
        expect(post.by.userId).to.equal(s._id)
        expect(post.by.name).to.equal(s.name)
        expect(post.by.bio).to.equal('yo yyoy o')
        expect(post.by.avatar).to.equal(s.avatar)
        expect(post.created).to.exist
        expect(post.updated).to.exist // updated is used to show admins recent edited posts
        expect(post.published).to.be.undefined
        expect(post.assetUrl).to.be.undefined
        expect(post.title).to.equal(d.title)
        expect(post.md).to.exist
        expect(post.tags.length).to.equal(0)
        done()
      })
    })
  })


  it('Create post as signed in user with max detail', function(done) {
    addAndLoginLocalUser('ajde', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'yes test', avatar: s.avatar }
      by.username = 'ajayD'
      by.social = {
        tw: { username: 'ajaytw' },
        gh: { username: 'ajaygh' },
        in: { id: 'ajayin' },
        so: { link: 'ajay/1231so' },
        gp: { id: 'ajaygp' }
      }
      var d = { title: "test", by: by, md: 'Test', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
      POST('/posts', d, {}, function(post) {
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
        expect(post.updated).to.exist
        expect(post.submitted).to.be.undefined
        expect(post.published).to.be.undefined
        expect(post.assetUrl).to.equal(d.assetUrl)
        expect(post.title).to.equal(d.title)
        expect(post.md).to.exist
        expect(post.tags.length).to.equal(0)
        done()
      })
    })
  })


  it('Not edit or delete post as non-author and non-editor', (done) => {
    addAndLoginLocalUser('evnr', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
      var d1 = { title: "test authed", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg' }
      POST('/posts', d1, {}, function(p1) {
        addAndLoginLocalUser('nevk', function(s2) {
          PUT(`/posts/${p1._id}`, { title: 'updated title' }, { status: 403 }, function(e1) {
            expect(e1.message).to.equal('Post must be updated by owner')
            DELETE(`/posts/${p1._id}`, { status: 403 }, function(e2) {
              expect(e2.message).to.equal('Post must be deleted by owner')
              done()
            })
          })
        })
      })
    })
  })


  it('Edit and delete post as author', (done) => {
    addAndLoginLocalUser('stpv', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
      var d1 = { title: "test authed delete", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg' }
      POST('/posts', d1, {}, function(p1) {
        expect(p1.slug).to.be.undefined
        p1.slug = d1.title.replace(/ /g,'-')+moment().format('X')
        PUT(`/posts/${p1._id}`, p1, {}, function(e2) {
          expect(e2.slug).to.equal(p1.slug)
          DELETE(`/posts/${p1._id}`, { status: 200 }, function(r) {
            GET('/posts/me', {}, function(posts) {
              var myposts = _.where(posts,(p)=>_.idsEqual(p.by.userId,s._id))
              expect(myposts.length).to.equal(0)
              done()
            })
          })
        })
      })
    })
  })


  it('Edit and delete post as editor', (done) => {
    addAndLoginLocalUser('stpu', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
      var d1 = { title: "test authed", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg' }
      POST('/posts', d1, {}, function(p1) {
        expect(p1.slug).to.be.undefined
        p1.slug = d1.title.replace(/ /g,'-')+moment().format('X')
        LOGIN('edap', data.users['edap'], function() {
          PUT(`/posts/${p1._id}`, p1, {}, function(e2) {
            expect(e2.slug).to.equal(p1.slug)
            DELETE(`/posts/${p1._id}`, { status: 200 }, function(r) {
              GET('/posts/me', {}, function(posts) {
                var myposts = _.where(posts,(p)=>_.idsEqual(p.by.userId,s._id))
                expect(myposts.length).to.equal(0)
                done()
              })
            })
          })
        })
      })
    })
  })


  it.skip('Not publish post as non-editor', (done) => {
    addAndLoginLocalUser('rapo', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
      var d1 = { title: "test not publish", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg'}
      POST('/posts', d1, {}, function(p1) {
        expect(p1.slug).to.be.undefined
        expect(p1.publish).to.be.undefined
        p1.slug = d1.title.replace(/ /g,'-')+moment().format('X')
        PUT(`/posts/${p1._id}`, p1, {}, function(e2) {
          expect(e2.slug).to.equal(p1.slug)
          PUT(`/posts/publish/${p1._id}`, p1, { status: 403 }, function(e1) {
            expect(e1.message).to.equal('Post must be published by an editor')
            done()
          })
        })
      })
    })
  })


  it.skip('Publish post as editor', function(done) {
    addAndLoginLocalUser('obie', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'auth test', avatar: s.avatar }
      var d1 = { title: "test publish as editor", by: by, md: 'Test auths 1', assetUrl: '/v1/img/css/blog/example2.jpg', publishReady: new Date()}
      POST('/posts', d1, {}, function(p1) {
        expect(p1.slug).to.be.undefined
        expect(p1.publish).to.be.undefined
        expect(p1.publishedBy).to.be.undefined
        p1.slug = d1.title.replace(/ /g,'-')+moment().format('X')
        LOGIN('edap', data.users['edap'], function() {
          PUT(`/posts/publish/${p1._id}`, p1, {}, function(p1pub) {
            expect(p1pub.published).to.exist
            expect(_.idsEqual(p1pub.publishedBy,data.users['edap']._id)).to.be.true
            done()
          })
        })
      })
    })
  })


  it.skip('Users own posts returns published and unpublished posts', function(done) {
    addAndLoginLocalUser('jkre', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var d1 = { title: "test 1", by: by, md: 'Test 1', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
      var d2 = { title: "test 2", by: by, md: 'Test 2', assetUrl: 'http://www.airpair.com/v1/img/css/blog/example2.jpg' }
      var d3 = { title: "test 3", by: by, md: 'Test 3', assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
      POST('/posts', d1, {}, function(p1) {
        POST('/posts', d2, {}, function(p2) {
          expect(p2.published).to.be.undefined
          p2.slug = "test-2-pub-"+moment().format('X')
          p2.publishReady = new Date()
          POST('/posts', d3, {}, function(p3) {
            LOGIN('edap', data.users.edap, function() {
              PUT('/posts/publish/'+p2._id, p2, {}, function(p2pub, resp) {
                expect(p2pub.published).to.exist
                LOGIN(s.userKey, data.users[s.userKey], function() {
                  GET('/posts/me', {}, function(posts) {
                    var myposts = _.where(posts,(p)=>_.idsEqual(p.by.userId,s._id))
                    expect(myposts.length).to.equal(3)
                    done()
                  })
                })
              })
            })
          })
        })
      })
    })
  })



  /* New Review Flow */
  it('submit for review fails without an authenticated GitHub account', function(done) {
    addAndLoginLocalUser('robot1', function(s) {
      var title = "test" + Math.floor(Math.random() * 100000000)
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, p1, {status: 403}, function(resp){
          expect(resp.message).to.equal("User must authorize GitHub to submit post for review")
          done()
        })
      })
    })
  })

  it("submit for review creates a repo with a README.md and a post.md file", function(done){
    addAndLoginLocalGithubUser("robot2", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
          expect(resp.submitted).to.exist
          expect(resp.github.repoInfo.reviewTeamId, "reviewTeamId").to.exist
          expect(resp.github.repoInfo.authorTeamId, "authorTeamId").to.exist
          expect(resp.github.repoInfo.owner, "githubOwner").to.exist
          expect(resp.github.repoInfo.author, "author").to.exist
          expect(resp.github.repoInfo.url, "github url").to.exist
          GET(`/posts/review`, {}, function(resp){
            var post = _.find(resp, function(post){
              return post.title === title
            })
            expect(post).to.exist
            done()
          })
        })
      })
    })
  })

  it('allows reviews to be added to submitted posts', function(done) {
    addAndLoginLocalUser('robot3', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var d1 = { title: "test 1", by: by, md: 'Test 1', assetUrl: 'http://youtu.be/qlOAbrvjMBo', submitted:new Date()}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/review/${p1._id}`, {body: "this post is great", stars: 4}, {}, function(resp){
          expect(resp.reviews[0].body).to.equal("this post is great")
          done()
        })
      })
    })
  })

  it.skip("allows forkers to be added to submitted posts", function(done){
    addAndLoginLocalGithubUser("robot4", {}, function(s){
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, p1, {}, function(resp){
          PUT(`/posts/${p1._id}`, p1, {}, function(resp){
            PUT(`/posts/add-forker/${p1._id}`, {}, {}, function(resp){
              expect(resp.forkers.length).to.equal(1)
              expect(resp.forkers[0].name).to.exist
              expect(resp.forkers[0].social.gh.username).to.exist
              GET(`/posts/forks/me`, {}, function(resp){
                expect(resp.length).to.equal(1)
                expect(resp[0].title).to.equal(title)
                done()
              })
            })
          })
        })
      })
    })
  })

  //store on last update
  //TODO maybe store a history soon..
  it("allows contents to be propagated from GitHub as author when in review", function(done){
    addAndLoginLocalGithubUser("robot5", {}, function(s){
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, p1, {}, function(resp){
          p1.md = "New content that will be erased when we update from GitHub"
          PUT(`/posts/${p1._id}`, p1, {status: 403}, function(resp){
            //expect(resp.err).to.equal("Updating markdown must happen through git flow")
            var update = {commitMessage: "Test update", md: p1.md + " and a bit more"}
            PUT(`/posts/update-github-head/${p1._id}`, update, {}, function(resp){
              github.getCommits(p1.slug, function(err,resp){
                expect(resp.length).to.equal(3)

                var initialCommit = _.find(resp, function(x){
                  return x.commit.message == "Initial Commit"
                })
                var readmeCommit = _.find(resp, function(x){
                  return x.commit.message == "Add README.md"
                })
                var updateCommit = _.find(resp, function(x){
                  return x.commit.message == "Test update"
                })

                //airpairtest is admin account
                //airpairtestreviewer is test user account

                expect(readmeCommit.author.login).to.equal("airpairtest")
                expect(updateCommit.author.login).to.equal("airpairtestreviewer")
                expect(initialCommit.author.login).to.equal("airpairtestreviewer")

                PUT(`/posts/propagate-head/${p1._id}`, {}, {}, function(resp){
                  expect(resp.md).to.equal(p1.md + " and a bit more")
                  done()
                })
              })
            })
          })
        })
      })
    })
  })

  it("allows contents to be updated from GitHub as editor", function(done){
    addAndLoginLocalGithubUser("robot10", {}, function(s){
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, p1, {}, function(resp){
          p1.contents = "New content that will be erased when we update from GitHub"
          PUT(`/posts/${p1._id}`, p1, {}, function(resp){
            LOGIN('edap', data.users.edap, function() {
              PUT(`/posts/propagate-head/${p1._id}`, p1, {}, function(resp){
                expect(resp.md).to.equal(lotsOfWords)
                done()
              })
            })
          })
        })
      })
    })
  })

  it("does not allow contents to be updated from GitHub as author once published", function(done){
    addAndLoginLocalGithubUser("robot11", {}, function(s){
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo',  published: Date.now()}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, p1, {}, function(resp){
          PUT(`/posts/propagate-head/${p1._id}`, p1, {status: 403}, function(resp){
            done()
          })
        })
      })
    })
  })


  it('does not allow submission for publication w/ <5 reviews', function(done) {
    addAndLoginLocalUser('robot7', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var d1 = { title: "test 1", by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo' }
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/publish/${p1._id}`, p1, {status: 403}, function(resp){
          expectStartsWith(resp.message, "Must have at least 5 reviews")
          done()
        })
      })
    })
  })


  it('allows author self publish w/ 5 reviews', function(done) {
    addAndLoginLocalGithubUser('robot8', {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var d1 = { title: "test 1", by: by, md: lotsOfWords,
          slug: `test-1-${timeSeed()}`, assetUrl: 'http://youtu.be/qlOAbrvjMBo',
        reviews: [
        {body: "this post is great", stars: 4},
        {body: "this post is great", stars: 4},
        {body: "this post is great", stars: 4},
        {body: "this post is great", stars: 4},
        {body: "this post is great", stars: 4}
      ]}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, p1, {}, function(){
          PUT(`/posts/propagate-head/${p1._id}`, p1, {}, function(resp){
            expect(resp.published).to.be.undefined
            expect(resp.by.userId).to.exist
            var publishData = {
              by: p1.by,
              tmpl: 'default',
              meta: { title: p1.title, description: 'Desc', canonical: `/tag/posts/${p1.slug}`,
                ogTitle: p1.title, ogDescription: 'Desc OG', ogImage: p1.assetUrl }
            }
            PUT(`/posts/publish/${p1._id}`, publishData, {}, function(resp){
              expect(resp.published).to.exist
              done()
            })
          })
        })
      })
    })
  })

  it("does not allow publishing of posts w/o a submitted for review timestamp", function(done){
    addAndLoginLocalUser('robot9', function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var d1 = { title: "test 1", by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo', slug: `no-publish-ready-${moment().format('X')}` }
      POST('/posts', d1, {}, function(p1) {
        LOGIN('edap', data.users.edap, function() {
          PUT('/posts/publish/'+p1._id, p1, {status: 403}, function(resp) {
            expect(resp.message).to.equal("Post must be submitted for review before being published")
            done()
          })
        })
      })
    })
  })

  it("correctly publishes a post when the repo already exists", function(done){
    addAndLoginLocalGithubUser("robot12", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      github.createRepo(title, function(err, result){
        if (err)
          done(err)
        POST('/posts', d1, {}, function(p1) {
          PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
            done()
          })
        })
      })
    })
  })

  it("correctly publishes if README has been added", function(done){
    addAndLoginLocalGithubUser("robot13", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      github.createRepo(title, function(err, result){
        if (err) done(err)
        setTimeout(function(){
          github.addFile(title, "README.md", "fake markdown", "Add README.md", null, function(err, result){
            if (err) return done(err)
            POST('/posts', d1, {}, function(p1) {
              PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
                done()
              })
            })
          })
        }, 2000)
      })
    })
  })

  it("correctly publishes if review team is already added", function(done){
    addAndLoginLocalGithubUser("robot14", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      github.createRepo(title, function(err, result){
        if (err) done(err)
        setTimeout(function(){
          POST('/posts', d1, {}, function(p1) {
            github.createRepoReviewTeam(title, p1._id, function(err, result){
              if (err) return done(err)
              PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
                done()
              })
            })
          })
        }, 2000)
      })
    })
  })

  it("correctly publishes if author team is already added", function(done){
    addAndLoginLocalGithubUser("robot15", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      github.createRepo(title, function(err, result){
        if (err) done(err)
        setTimeout(function(){
          POST('/posts', d1, {}, function(p1) {
            github.createRepoAuthorTeam(title, p1._id, function(err, result){
              if (err) return done(err)
              PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
                done()
              })
            })
          })
        }, 2000)
      })
    })
  })

  it("proceeds when author has already been added to author team", function(done){
    addAndLoginLocalGithubUser("robot16", {}, function(s) {
      var user = s
      user.social.gh.token = {token:"bc9a4b0e5ca18b5ee39bc8cbecb07586c4fbe9c4"}
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      github.createRepo(title, function(err, result){
        if (err) done(err)
        //without a timeout repo is often not found immediately after creation
        setTimeout(function(){
          POST('/posts', d1, {}, function(p1) {
            github.createRepoAuthorTeam(title, p1._id, function(err, result){
              if (err) return done(err)
              var authorTeamId = result.id;
              github.addToTeam(s.social.gh.username, authorTeamId, user, function(err, result){
                if (err) return done(err)
                PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
                  done()
                })
              })
            })
          })
        }, 2000)
      })
    })
  })

  it("does not allow publish post to be invoked twice", function(done){
    addAndLoginLocalGithubUser("robot17", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
          PUT(`/posts/submit/${p1._id}`, d1, {status: 403}, function(resp){
            done()
          })
        })
      })
    })
  })

  it("allows a post to be deleted and recreated w/ github repo still standing", function(done){
    addAndLoginLocalGithubUser("robot19", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
          LOGIN('edap', data.users['edap'], function(editor) {
            DELETE(`/posts/${p1._id}`, {}, function(){
              addAndLoginLocalGithubUser("robot19", {}, function(user){
                POST('/posts', d1, {}, function(p1) {
                  PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
                    done()
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  it("allows a post to be deleted and recreated w/ github repo destroyed", function(done){
    addAndLoginLocalGithubUser("robot20", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
          LOGIN('edap', data.users['edap'], function(editor) {
            DELETE(`/posts/${p1._id}`, {}, function(){
              deleteRepo(config.auth.github.org, d1.slug, config.auth.github.adminAccessToken, function(err,res){
                if (err) return done(err);
                addAndLoginLocalGithubUser("robot20", {}, function(user){
                  POST('/posts', d1, {}, function(p1) {
                    PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
                      done()
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  it("should show the correct scopes", function(done){
    addAndLoginLocalGithubUser("robot18", {}, function(user) {
      user.social.gh.token = {token:"bc9a4b0e5ca18b5ee39bc8cbecb07586c4fbe9c4"}
      GET('/users/me/provider-scopes', {}, function(result){
        expect(result.github).to.contain("repo")
        expect(result.github).to.contain("user")
        done()
      })
    })
  })

  it("updating github head as a forker updates their fork", function(done){
    addAndLoginLocalGithubUser("robot21", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
          var token = "fd65392d8926f164755061e70a852d4ebe139e09"
          var username = "airpairtester45"
          addAndLoginLocalGithubUser("robot22", {token,username}, function(user){
            expect(user.social.gh.username).to.equal("airpairtester45")
            PUT(`/posts/add-forker/${p1._id}`, {}, {}, function(resp){
              expect(resp.forkers.length).to.equal(1)
              expect(_.idsEqual(resp.forkers[0].userId, user._id))
              setTimeout(function(){
                github.getRepo(user.social.gh.username, title, function(err,result){
                  if (err) return done(err)
                  expect(result.owner.login).to.equal("airpairtester45")
                  var forkerPrefix = "a nice introduction"
                  PUT(`/posts/update-github-head/${p1._id}`, {md: `${forkerPrefix}${lotsOfWords}`, commitMessage:"suggested change"}, {}, function(resp){
                    user.social.gh.token = {token}
                    github.getFile(title, "post.md", user.social.gh.username, user, function(err,result){
                      expect(result.string).to.equal(`${forkerPrefix}${lotsOfWords}`)
                      GET(`/posts/head/${p1._id}`, {}, function(resp){
                        expect(resp.string).to.equal(`${forkerPrefix}${lotsOfWords}`)
                        LOGIN(s.userKey, data.users[s.userKey], function(originalAuthor){
                          GET(`/posts/head/${p1._id}`, {}, function(resp){
                            expect(resp.string).to.equal(lotsOfWords)
                            done()
                          })
                        })

                      })
                    })

                  })
                })
              }, 2000)
            })
          })
        })
      })
    })
  })

  it("recreates a fork when a user opens their editor after manually deleting it", function(done){
    addAndLoginLocalGithubUser("robot23", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
          var token = "fd65392d8926f164755061e70a852d4ebe139e09"
          var username = "airpairtester45"
          addAndLoginLocalGithubUser("robot24", {token,username}, function(user){
            expect(user.social.gh.username).to.equal("airpairtester45")
            PUT(`/posts/add-forker/${p1._id}`, {}, {}, function(resp){
              expect(resp.forkers.length).to.equal(1)
              expect(_.idsEqual(resp.forkers[0].userId, user._id))
              setTimeout(function(){
                user.social.gh.token = {token}
                deleteRepo(user.social.gh.username, d1.slug, user.social.gh.token.token, function(err,res){
                  if (err) return done(err)
                  github.getRepo(user.social.gh.username, title, function(err, response){
                    expect(err.code).to.equal(404)
                    GET(`/posts/head/${p1._id}`, {status: 400}, function(resp){
                      expect(resp.message).to.match(/No fork present. Create one/)
                      done()
                    })
                  })
                })
              }, 2000)
            })
          })
        })
      })
    })
  })

  it.skip("correctly displays 'out of sync' message when fork is behind master", function(done){
    addAndLoginLocalGithubUser("robot23", {}, function(s) {
      var by = { userId: s._id, name: s.name, bio: 'jk test', avatar: s.avatar }
      var title = "test" + Math.floor(Math.random() * 100000000)
      var d1 = { title: title, slug:title, by: by, md: lotsOfWords, assetUrl: 'http://youtu.be/qlOAbrvjMBo'}
      POST('/posts', d1, {}, function(p1) {
        PUT(`/posts/submit/${p1._id}`, d1, {}, function(resp){
          var token = "fd65392d8926f164755061e70a852d4ebe139e09"
          var username = "airpairtester45"
          addAndLoginLocalGithubUser("robot24", {token,username}, function(user){
            expect(user.social.gh.username).to.equal("airpairtester45")
            PUT(`/posts/add-forker/${p1._id}`, {}, {}, function(resp){
              expect(resp.forkers.length).to.equal(1)
              expect(_.idsEqual(resp.forkers[0].userId, user._id))
              LOGIN(s.userKey, data.users[s.userKey], function(originalAuthor){
                var masterPrefix = "I AM YOUR MASTER"
                PUT(`/posts/update-github-head/${p1._id}`, {md: `${masterPrefix}${lotsOfWords}`}, function(resp){
                  github.behindMaster(user)
                })
              })
            })
          })
        })
      })
    })
  })
})
