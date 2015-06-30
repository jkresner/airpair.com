function api() {


  it('Gets sessionId on anonymous session', function(done) {
    var opts = { unauthenticated: true }
    GET('/session/full', opts, function(s) {
      expect(s.authenticated).to.be.false
      expect(s.sessionID).to.exist
      done()
    })
  })


  it('Does not wipe existing local login data with anonymous tags and bookmarks data', function(done) {
    SETUP.addAndLoginLocalUser('wlmo', function(sWlmo) {
      PUT(`/users/me/bookmarks/post/${data.posts.v1AirPair._id}`, {}, {}, function(s1) {
        expect(s1.bookmarks.length).to.equal(1)
        expect(s1.bookmarks[0].title).to.equal("Starting a Mean Stack App")
        expect(s1.bookmarks[0].type).to.equal("post")
        PUT(`/users/me/tag/node.js`, {}, {}, function(s2) {
          expect(s2.bookmarks.length).to.equal(1)
          expect(s2.tags.length).to.equal(1)
          expect(s2.tags[0].name).to.equal("Node.JS")
          expect(s2.tags[0].slug).to.equal("node.js")
          ANONSESSION((anon) => {
            expect(anon.bookmarks).to.be.undefined
            expect(anon.tags).to.be.undefined
            LOGIN(sWlmo.userKey, () => {
              GET('/session/full', {}, (sFull) => {
                expect(sFull.bookmarks.length).to.equal(1)
                expect(sFull.bookmarks[0].title).to.equal("Starting a Mean Stack App")
                expect(sFull.bookmarks[0].type).to.equal("post")
                expect(sFull.tags.length).to.equal(1)
                expect(sFull.tags[0].name).to.equal("Node.JS")
                expect(sFull.tags[0].slug).to.equal("node.js")
                done()
              })
            })
          })
        })
      })
    })
  })

}


function stack() {

  it('Add tag data to anonymous session', function(done) {
    http(global.app)
      .put('/v1/api/users/me/tag/node.js')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, resp){
        cookie = resp.headers['set-cookie']
        GET('/session/full', {}, function(s) {
          expect(s.authenticated).to.be.false
          expect(s.sessionID).to.exist
          expect(s.tags).to.exist
          expect(s.tags.length).to.equal(1)
          expect(s.tags[0].name).to.equal('Node.JS')
          expect(s.tags[0].slug).to.equal('node.js')
          expect(s.tags[0].sort).to.equal(0)
          done()
        })
      })
  })


  it('Add up to 3 tags to anonymous session', function(done) {
    http(global.app)
      .put('/v1/api/users/me/tag/node.js')
      .end(function(err, resp){
        cookie = resp.headers['set-cookie']
        PUT('/users/me/tag/angularjs', {}, {}, function(s2) {
          PUT('/users/me/tag/mongodb', {}, {}, function(s3) {
            expect(s3.authenticated).to.be.false
            expect(s3.sessionID).to.exist
            expect(s3.tags).to.exist
            expect(s3.tags.length).to.equal(3)
            PUT('/users/me/tag/ruby-on-rails', {}, { status: 400 }, function(resp) {
              expect(resp.message.indexOf('Max 3 tags reached') != -1).to.be.true
              done()
            })
          })
        })
      })
  })

  it('Sort 2 tags on anonymous session', function(done) {
    http(global.app)
      .put('/v1/api/users/me/tag/node.js')
      .end(function(err, resp){
        cookie = resp.headers['set-cookie']
        PUT('/users/me/tag/angularjs', {}, {}, function(s2) {
          var tags = s2.tags
          expect(tags).to.exist
          expect(tags.length).to.equal(2)
          expect(tags[0].sort).to.equal(0)
          expect(tags[1].sort).to.equal(0)
          tags[0].sort = 1
          tags[1].sort = 0
          PUT('/users/me/tags', tags, {}, function(s3) {
            expect(s3.authenticated).to.be.false
            expect(s3.sessionID).to.exist
            expect(s3.tags).to.exist
            expect(s3.tags.length).to.equal(2)
            expect(s3.tags[0].sort).to.equal(1)
            expect(s3.tags[1].sort).to.equal(0)
            done()
          })
        })
      })
  })

  it('Remove tag from anonymous session', function(done) {
    http(global.app)
      .put('/v1/api/users/me/tag/node.js')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, resp){
        if (err) done(err)
        cookie = resp.headers['set-cookie']
        //-- Remove the tag
        PUT('/users/me/tag/node.js', {}, {}, function(s2){
          expect(s2.tags).to.exist
          expect(s2.tags.length).to.equal(0)
          GET('/session/full', {}, function(s) {
            expect(s.authenticated).to.be.false
            expect(s.sessionID).to.exist
            expect(s.tags).to.exist
            expect(s.tags.length).to.equal(0)
            done()
          })
        })
      })
  })


  it('Copies anonymous tag data to new local signup user', itDone((done) =>
    http(global.app)
      .put('/v1/api/users/me/tag/mongodb')
      .end( (err, resp) => {
        cookie = resp.headers['set-cookie']
        GET('/session/full', {}, (s) => {
          expect(s.tags[0].name).to.equal('MongoDB')
          var signup = SETUP.userData('ramo')
          http(global.app).post('/v1/auth/signup')
            .send(signup)
            .set('cookie',cookie)
            .end(function(err, resp) {
              if (err) return done(err)
              var newUser = resp.body
              expect(newUser._id).to.exist
              expect(newUser.name).to.equal(signup.name)
              expect(newUser.tags).to.exist
              expect(newUser.tags.length).to.equal(1)
              expect(newUser.tags[0].name).to.equal('MongoDB')
              expect(newUser.emailVerified).to.equal(false)
              GET('/session/full', {}, (sFull) => {
                expect(sFull._id).to.exist
                expect(sFull.name).to.equal(signup.name)
                expect(sFull.tags).to.exist
                expect(sFull.tags.length).to.equal(1)
                expect(sFull.tags[0].name).to.equal('MongoDB')
                expect(sFull.emailVerified).to.equal(false)
                done()
              })
            })
        })
      })
  ))


  it('Can add and remove tags to authenticated session', function(done) {
    SETUP.addAndLoginLocalUser('arys', function(s) {
      PUT('/users/me/tag/node.js', {}, {}, function(s1) {
        expect(s1.tags.length).to.equal(1)
        expect(s1.tags[0].name).to.equal('Node.JS')
        PUT('/users/me/tag/angularjs', {}, {}, function(s2) {
          expect(s2.tags.length).to.equal(2)
          PUT('/users/me/tag/node.js', {}, {}, function(s3) {
            expect(s3.tags.length).to.equal(1)
            expect(s3.tags[0].name).to.equal('AngularJS')
            done()
          })
        })
      })
    })
  })

}


function bookmarks() {

  it('Can add bookmark data to anonymous session', function(done) {
    http(global.app)
      .put(`/v1/api/users/me/bookmarks/post/${data.posts.v1AirPair._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, resp){
        if (err) throw err
        cookie = resp.headers['set-cookie']
        GET('/session/full', {}, function(s) {
          expect(s.authenticated).to.be.false
          expect(s.sessionID).to.exist
          expect(s.bookmarks).to.exist
          expect(s.bookmarks.length).to.equal(1)
          expect(s.bookmarks[0].title).to.equal("Starting a Mean Stack App")
          expect(s.bookmarks[0].type).to.equal("post")
          done()
        })
      })
  })


  it('Can add up to 3 bookmarks to anonymous session', function(done) {
    http(global.app)
      .put(`/v1/api/users/me/bookmarks/post/${data.posts.sessionDeepDive._id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, resp){
        cookie = resp.headers['set-cookie']
        PUT(`/users/me/bookmarks/post/${data.posts.v1AirPair._id}`, {}, {}, function(s2) {
          PUT(`/users/me/bookmarks/post/${data.posts.sessionDeepDive2._id}`, {}, {}, function(s3) {
            GET('/session/full', {}, function(s) {
              expect(s.authenticated).to.be.false
              expect(s.sessionID).to.exist
              expect(s.bookmarks).to.exist
              expect(s.bookmarks.length).to.equal(3)
              PUT(`/users/me/bookmarks/post/${data.posts.migrateES6._id}`, {}, { status: 400 }, function(resp) {
                expect(resp.message.indexOf('Max 3 bookmarks reached') != -1).to.be.true
                done()
              })
            })
          })
        })
      })
  })


  it('Copies anonymous bookmarks data to new local signup user', (done) =>
    http(global.app)
      .put(`/v1/api/users/me/bookmarks/post/${data.posts.sessionDeepDive._id}`)
      .end( (err, resp) => {
        cookie = resp.headers['set-cookie']
        GET('/session/full', {}, (s) => {
          expect(s.bookmarks[0].title).to.equal('ExpressJS and PassportJS Sessions Deep Dive')
          var singup = SETUP.userData('alry')
          http(global.app).post('/v1/auth/signup').send(singup)
            .set('cookie',cookie)
            .end( (err, resp) =>
              GET('/session/full', {}, (sFull) => {
                expect(sFull._id).to.exist
                expect(sFull.name).to.equal(singup.name)
                expect(sFull.bookmarks).to.exist
                expect(sFull.bookmarks.length).to.equal(1)
                expect(sFull.bookmarks[0].title).to.equal('ExpressJS and PassportJS Sessions Deep Dive')
                done()
              })
            )
        })
      })
  )


  it('Can add and remove bookmarks to authenticated session', function(done) {
    SETUP.addAndLoginLocalUser('alys', function(s) {
      PUT(`/users/me/bookmarks/post/${data.posts.v1AirPair._id}`, {}, {}, function(s1) {
        expect(s1.bookmarks.length).to.equal(1)
        expect(s1.bookmarks[0].title).to.equal("Starting a Mean Stack App")
        expect(s1.bookmarks[0].type).to.equal("post")
        PUT(`/users/me/bookmarks/post/${data.posts.sessionDeepDive._id}`, {}, {}, function(s2) {
          expect(s2.bookmarks.length).to.equal(2)
          PUT(`/users/me/bookmarks/post/${data.posts.v1AirPair._id}`, {}, {}, function(s3) {
            expect(s3.bookmarks.length).to.equal(1)
            expect(s3.bookmarks[0].title).to.equal('ExpressJS and PassportJS Sessions Deep Dive')
            done()
          })
        })
      })
    })
  })


  it('Can login and get previous sessions bookmarks', function(done) {
    SETUP.addAndLoginLocalUser('wilm', function(s) {
      PUT(`/users/me/bookmarks/post/${data.posts.v1AirPair._id}`, {}, {}, function(s1) {
        expect(s1.bookmarks.length).to.equal(1)
        expect(s1.bookmarks[0].title).to.equal("Starting a Mean Stack App")
        expect(s1.bookmarks[0].type).to.equal("post")
        LOGIN(s.userKey, function() {
          GET('/session/full', {}, (sFull) => {
            expect(sFull.bookmarks.length).to.equal(1)
            expect(sFull.bookmarks[0].title).to.equal("Starting a Mean Stack App")
            expect(sFull.bookmarks[0].type).to.equal("post")
            done()
          })
        })
      })
    })
  })

}


function profileAnonymous() {

  it('Can update email', function(done) {
    var clone = SETUP.userData('kfor')
    http(global.app)
      .put('/v1/api/users/me/email')
      .send({email:clone.email})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, resp){
        cookie = resp.headers['set-cookie']
        expect(resp.body.email).to.equal(clone.email)
        expect(resp.body.authenticated).to.equal(false)
        expect(resp.body.avatar).to.exist
        expect(resp.body.sessionID).to.exist
        GET('/session/full', {}, function(s) {
          expect(s.email).to.equal(clone.email)
          expect(s.authenticated).to.equal(false)
          expect(s.avatar).to.exist
          expect(s.sessionID).to.exist
          done()
        })
      })
  })

  it('Can update name', function(done) {
    var clone = SETUP.userData('mthm')
    http(global.app)
      .put('/v1/api/users/me/name')
      .send({name:clone.name})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, resp){
        cookie = resp.headers['set-cookie']
        expect(resp.body.name).to.equal(clone.name)
        expect(resp.body.authenticated).to.equal(false)
        expect(resp.body.avatar).to.exist
        expect(resp.body.sessionID).to.exist
        GET('/session/full', {}, function(s) {
          expect(s.name).to.equal(clone.name)
          expect(s.authenticated).to.equal(false)
          expect(s.avatar).to.exist
          expect(s.sessionID).to.exist
          done()
        })
      })
  })


  it('Can update email and name', function(done) {
    var clone = SETUP.userData('cmck')
    http(global.app)
      .put('/v1/api/users/me/email')
      .send({email:clone.email})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, resp){
        cookie = resp.headers['set-cookie']
        expect(resp.body.email).to.equal(clone.email)
        expect(resp.body.name).to.be.undefined
        PUT('/users/me/name', {name:clone.name}, {}, (s2) => {
          expect(s2.email).to.equal(clone.email)
          expect(s2.name).to.equal(clone.name)
          GET('/session/full', {}, function(s) {
            expect(s.name).to.equal(clone.name)
            expect(s.email).to.equal(clone.email)
            done()
          })
        })
      })
  })

}

function profileAuthenticated() {

  it('Can update name', function(done) {
    SETUP.addAndLoginLocalUserWithEmailVerified('sctm', function(s) {
      expect(s._id).to.exist
      expect(s.email).to.exist
      expect(s.name).to.exist
      expect(s.avatar).to.exist
      expect(s.emailVerified).to.equal(true)
      expect(s.initials).to.be.undefined
      expect(s.username).to.be.undefined

      var originalName = s.name

      PUT('/users/me/name', { name: 'test UP' }, {}, function(s2) {
        // expect(r.initials).to.equal('IN')
        expect(s2.name).to.equal('test UP')
        GET('/session/full', {}, (s2) => {
          expect(s2.name).to.equal('test UP')
          done()
        })
      })
    })
  })

}


module.exports = () => {

  before(function(done) {
    SETUP.initPosts(done)
  })

  describe("API: ".subspec, api)
  describe("Stack: ".subspec, stack)
  describe("Bookmarks: ".subspec, bookmarks)
  describe("Profile: anonymous: ".subspec, profileAnonymous)
  describe("Profile: authenticated: ".subspec, profileAuthenticated)
}
