UserService = require('../../server/services/users')
util = require('../../shared/util')

module.exports = -> describe "Signup: ", ->

  @timeout(6000)

  before (done) ->
    stubAnalytics()
    testDb.initPosts () ->
      testDb.initTags(done)


  after (done) ->
    resotreAnalytics()
    global.cookie = null
    global.cookieCreatedAt = null
    done()


  it 'Can sign up as new user with local credentials', (done) ->
    d = getNewUserData('jkap')

    http(global.app).post('/v1/auth/signup').send(d).expect(200)
      .end (err, resp) ->
        if (err) then throw err
        global.cookie = resp.headers['set-cookie']
        r = resp.body
        expect(r._id).to.exist
        expect(r.google).to.be.undefined
        expect(r.googleId).to.be.undefined
        expect(r.name).to.equal(d.name)
        expect(r.email).to.equal(d.email)
        expect(r.emailVerified).to.equal(false)
        expect(r.local).to.be.undefined  # holds password field
        expect(r.roles).to.be.undefined # new users have undefined roles
        expect(r.cohort.engagement).to.exist
        GET '/session/full', {}, (s) ->
          expect(s._id).to.exist
          expect(s.google).to.be.undefined
          expect(s.googleId).to.be.undefined
          expect(s.name).to.equal(d.name)
          expect(s.email).to.equal(d.email)
          expect(s.emailVerified).to.equal(false)
          expect(s.local).to.be.undefined  # holds password field
          expect(s.roles).to.be.undefined # new users have undefined roles
          expect(s.cohort.engagement).to.exist
          done()


  it 'New user has correct cohort information', (done) ->
    addLocalUser 'dysn', {}, (userKey) ->
      userId = data.users[userKey]._id
      testDb.readUser userId, (e,r) ->
        {cohort} = r
        expect(moment(cohort.engagement.visit_first).unix()).to.equal(moment(cookieCreatedAt).unix())
        expect(cohort.engagement.visit_signup).to.be.exist
        expect(cohort.engagement.visit_last).to.be.exist
        expect(cohort.engagement.visits.length).to.equal(1)
        expect(moment(cohort.engagement.visits[0]).unix()).to.equal(moment(util.dateWithDayAccuracy()).unix())
        expect(cohort.aliases.length).to.equal(1)
        expect(cohort.aliases[0].indexOf("testdysn")).to.equal(0)
        done()


  it 'Can sign up as new user with google', (done) ->
    UserService.upsertProviderProfile.call newUserSession(), 'google', data.oauth.rbrw, (e,usr) ->
      LOGIN 'rbrw', usr, ->
        GET '/session/full', {}, (s) ->
          expect(s._id).to.equal(usr._id.toString())
          expect(s.email).to.equal(usr.email)
          expect(s.name).to.equal(usr.name)
          expect(s.googleId).to.be.undefined  # not returned from session call
          expect(s.google.id).to.equal(data.oauth.rbrw.id)
          expect(s.emailVerified).to.equal(false)
          expect(s.local).to.be.undefined  # holds password field
          expect(s.roles).to.be.undefined  # new users have undefined roles
          expect(s.cohort.engagement).to.exist
          done()


  it 'Cannot sign up with local credentials and existing gmail', (done) ->
    d = name: "AirPair Experts", email: "experts@airpair.com", password: "Yoyoyoyoy"

    UserService.upsertProviderProfile.call newUserSession(), 'google', data.oauth.exap, (e,usr) ->
      expect(usr._id).to.exist
      http(global.app).post('/v1/auth/signup').send(d)
        .expect(400)
        .expect('Content-Type', /json/)
        .end (err, res) ->
          if (err) then return done(err)
          expect(res.body.error).to.equal('try google login')
          done()


  it 'Cannot sign up with local credentials and existing local email', (done) ->
    d = getNewUserData('jkap')
    http(global.app).post('/v1/auth/signup').send(d).expect(200)
      .end (e, r) ->
        http(global.app).post('/v1/auth/signup').send(d).expect(400)
          .end (err, res) ->
            if (err) then return done(err)
            expect(res.body.error).to.equal('user already exists')
            done()






  describe "Login", ->

    it 'Login of existing v0 user creates cohort', (done) ->
      testDb.ensureDoc 'User', data.v0.users.SoumyaAcharya, (e, sou) ->
        expect(_.idsEqual sou._id, "51a6668866a6f999a465f2fc").to.be.true
        expect(sou.email).to.be.undefined
        expect(sou.name).to.be.undefined
        expect(sou.cohort.visit_first).to.be.undefined
        expect(sou.cohort.aliases.length).to.equal(0)
        UserService.upsertProviderProfile.call newUserSession('SoumyaAcharya'), 'google', sou.google, (ee,u) ->
          expect(u.email).to.equal(sou.google._json.email)
          expect(u.name).to.equal(sou.google.displayName)
          expect(u.emailVerified).to.be.false
          # expect(u.cohort.aliases.length).to.equal(1)
          # expect(u.cohort.aliases[0].indexOf('testSoumyaAcharya')).to.equal(0)
          expect(u.cohort.engagement.visit_first).to.exist
          expect(moment(u.cohort.engagement.visit_signup).unix()).to.equal(moment(util.ObjectId2Date(sou._id)).unix())
          expect(u.cohort.engagement.visit_last).to.exists
          expect(u.cohort.engagement.visits.length).to.equal(1)
          done()


    it 'Can signup with local credentials then login with google of same email', (done) ->
      testDb.ensureDoc 'User', data.users.aone, (e, aone) ->
        expect(aone.email).to.equal('airpairone001@gmail.com')
        expect(aone.google).to.be.undefined
        expect(aone.googleId).to.be.undefined
        UserService.upsertProviderProfile.call newUserSession('aone'), 'google', data.oauth.aone.google, (ee,user) ->
          testDb.readUser user._id, (e,r) ->
            expect(r.googleId).to.equal(data.oauth.aone.google._json.id)
            expect(r.google._json.email).to.equal('airpairone001@gmail.com')
            expect(r.email).to.equal('airpairone001@gmail.com')
            done()


    it 'Google login for existing v1 user works after played with singup form', (done) ->
      testDb.ensureDoc 'User', data.users.samt, (e, samt) ->
        expect(samt.email).to.equal('san.thanki@gmail.com')
        expect(samt.google).to.exist
        expect(samt.googleId).to.equal('107929348314160277508')
        svcCtx = newUserSession('samt')
        svcCtx.session.anonData = { email: null }
        UserService.upsertProviderProfile.call svcCtx, 'google', data.oauth.samt.google, (ee,user) ->
          expect(user).to.exist
          testDb.readUser user._id, (e,r) ->
            expect(r.googleId).to.equal(data.oauth.samt.google._json.id)
            expect(r.google._json.email).to.equal("san.thanki@gmail.com")
            expect(r.email).to.equal("san.thanki@gmail.com")
            done()


    it 'Google login for existing v1 user doesnt blow up when tag not found', (done) ->
      testDb.ensureDoc 'User', data.users.bbe, (e, bbe) ->
        expect(bbe.email).to.equal('ben.beetle@gmail.com')
        expect(bbe.google).to.exist
        expect(bbe.googleId).to.equal('108341472603890720649')
        svcCtx = newUserSession('bbe')
        UserService.upsertProviderProfile.call svcCtx, 'google', data.oauth.bbe.google, (ee,user) ->
          expect(user).to.exist
          testDb.readUser user._id, (e,r) ->
            expect(r.googleId).to.equal(data.oauth.bbe.google._json.id)
            expect(r.google._json.email).to.equal('ben.beetle@gmail.com')
            expect(r.email).to.equal('ben.beetle@gmail.com')
            done()


    it.skip 'TODO: Login from a new anonymous session adds sessionID to aliases', () ->
      # expect('updates last visit')

    it.skip 'TODO: Login from existing anonymous session leaves aliases', () ->

  #   it('login google: no google, has local, google login matching local email')
  #     expect('login success')
  #     expect('profile upsert success')
  #     expect('google').toExist()
  #     expect('googleId').toExist()

  #   it('login local: user has google, no local, with google email address')
  #     expect('login fail')
  #     expect('tell no matching password')
  #     expect('ask user to google login')

  #   it('signup local: no google, has local, singup with matching local email')
  #     expect('signup fail')
  #     expect('ask user to login')
  # }

  describe "Password", ->


    it 'Can request a password change, and set a new local password', (done) ->
      new_password = 'drowssap'
      spy = sinon.spy(mailman,'sendChangePasswordEmail')
      d = getNewUserData('prak')
      addAndLoginLocalUser 'prak', (user) ->
        PUT '/users/me/password-change', {email: d.email}, {}, ->
          expect(spy.callCount).to.equal(1)
          generated_hash = spy.args[0][1]
          expect(generated_hash).to.not.be.empty
          testDb.readUser user._id, (e,r) ->
            expect(r.local.changePasswordHash).to.equal(generated_hash)
            old_password_hash = r.local.password
            data = { hash: generated_hash, password: new_password }
            PUT "/users/me/password", data, {unauthenticated: true}, (s) ->
              UserService.tryLocalLogin.call newUserSession(), d.email, new_password, (e,r) ->
                if (e)
                  done(e)
                testDb.readUser user._id, (e,r) ->
                  if (e) then return done(e)
                  expect(old_password_hash).to.not.equal(r.local.password)
                  expect(r.local.changePasswordHash).to.be.empty
                  done()


    it 'must supply a valid email when requesting a password change', (done) ->
      addAndLoginLocalUser 'stjp', (user) ->
        PUT '/users/me/password-change', {email: "abc"}, { status: 403 }, (r) ->
          expect(r.message).to.include('Invalid email address')
          done()

    it 'cannot change local password to an short password', (done) ->
      PUT "/users/me/password", {hash: "ABC", password:"abc"}, {status:403, unauthenticated: true}, (r) ->
        expect(r.message).to.include('Invalid password')
        done()

    it 'cannot change local password with any empty hash', (done) ->
      PUT "/users/me/password", {hash: "", password:"newpassword"}, {status:403, unauthenticated: true}, (r) ->
        expect(r.message).to.include('Invalid hash')
        done()


  describe "Change and verify e-mail", ->

    # it.skip 'send a verification email to new users'

    it 'Local user can change their email', (done) ->
      the_new_email = "hello" + moment().format('X').toString() + "@mydomain.com"
      addAndLoginLocalUserWithEmailVerified 'spgo', (s) ->
        expect(s.emailVerified).to.be.true
        PUT '/users/me/email', {email: the_new_email}, {}, ->
          GET '/session/full', {}, (s) ->
            expect(s.email).to.equal(the_new_email)
            expect(s.emailVerified).to.be.false
            done()


    it 'Cannot change a users email to just any string', (done) ->
      the_new_email = "justsomestring"
      addAndLoginLocalUserWithEmailVerified 'shan', (s) ->
        expect(s.emailVerified).to.be.true
        PUT '/users/me/email', {email: the_new_email}, {status:403}, (e)->
          expect(e.message).to.include('Invalid email address')
          done()


    it 'Cannot change email with empty string', (done) ->
      addAndLoginLocalUserWithEmailVerified 'scol', (s) ->
        expect(s.emailVerified).to.be.true
        PUT '/users/me/email', {}, {status:403}, (e)->
          expect(e.message).to.include('Invalid email address')
          done()


    it 'Cannot change email to an existing users email', (done) ->
      addAndLoginLocalUserWithEmailVerified 'scmo', (s) ->
        expect(s.emailVerified).to.be.true
        PUT '/users/me/email', {email:'admin@airpair.com'}, {status:400}, (e)->
          expect(e.message).to.include('Email belongs to another account')
          done()


    it.skip 'deny user if e-mail is not verified', (done) ->
      d = getNewUserData('spur')
      addAndLoginLocalUser 'spur', (userKey) ->
        GET '/billing/orders', { status: 403 }, (err) ->
          expect(err.message).to.equal('e-mail not verified')
          done()


    it 'user can only verify e-mail when logged in', (done) ->
      http(global.app)
        .put('/v1/api/users/me/email-verify')
        .send({hash:'yoyoy'})
        .expect(401)
        .end (err, res) ->
          if (err) then return done(err)
          done()


    it.skip 'users can verify email for some features', (done) ->
      spy = sinon.spy(mailman,'sendVerifyEmail')
      addAndLoginLocalUser 'stev', (s) ->
        GET '/billing/orders', { status: 403 }, (err) ->
          expect(err.message).to.equal('e-mail not verified')
          PUT '/users/me/email', { email: s.email }, {}, (s2) ->
            expect(spy.callCount).to.equal(1)
            hash = spy.args[0][1]
            PUT "/users/me/email-verify", { hash }, {}, (sVerified) ->
              expect(sVerified.emailVerified).to.be.true
              GET '/billing/orders', {}, (order) ->
                spy.restore()
                done()


    it 'bad verification link does not verify the user', (done) ->
      addAndLoginLocalUser 'step', (s) ->
        fakeHash = 'ABCDEF1234567'
        PUT "/users/me/email-verify", { hash: fakeHash }, { status: 400 }, (r) ->
          expect(r.message).to.equal("e-mail verification failed")
          done()
