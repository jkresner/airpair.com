db = require('./helpers/setup.db')
UserService = require('../../server/services/users')
util = require('../../shared/util')

module.exports = -> describe "Signup: ", ->

  @timeout(6000)

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initPosts ->
      SETUP.initTags(done)

  after ->
    SETUP.analytics.restore()


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


  it 'Can sign up as new user with google', (done) ->
    UserService.googleLogin.call newUserSession(), data.oauth.rbrw, (e,usr) ->
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

    UserService.googleLogin.call newUserSession(), data.oauth.exap, (e,usr) ->
      expect(usr._id).to.exist
      http(global.app).post('/v1/auth/signup').send(d)
        .expect(400)
        .expect('Content-Type', /json/)
        .end (err, res) ->
          if (err) then return done(err)
          expect(res.body.error).to.equal('Cannot signup, you previously created an account with your google login')
          done()


  it 'Cannot sign up with local credentials and existing local email', (done) ->
    d = getNewUserData('jkap')
    http(global.app).post('/v1/auth/signup').send(d).expect(200)
      .end (e, r) ->
        http(global.app).post('/v1/auth/signup').send(d).expect(400)
          .end (err, res) ->
            if (err) then return done(err)
            expect(res.body.error).to.equal('Cannot signup, user already exists')
            done()


  describe "Login", ->

    it 'Login of existing v0 user creates cohort', (done) ->
      db.ensureDoc 'User', data.v0.users.SoumyaAcharya, (e, sou) ->
        expect(_.idsEqual sou._id, "51a6668866a6f999a465f2fc").to.be.true
        expect(sou.email).to.be.undefined
        expect(sou.name).to.be.undefined
        expect(sou.cohort.visit_first).to.be.undefined
        expect(sou.cohort.aliases.length).to.equal(0)
        UserService.googleLogin.call newUserSession('SoumyaAcharya'), sou.google, (ee,u) ->
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
      db.ensureDoc 'User', data.users.aone, (e, aone) ->
        expect(aone.email).to.equal('airpairone001@gmail.com')
        expect(aone.google).to.be.undefined
        expect(aone.googleId).to.be.undefined
        UserService.googleLogin.call newUserSession('aone'), data.oauth.aone.google, (ee,user) ->
          testDb.readUser user._id, (e,r) ->
            expect(r.googleId).to.equal(data.oauth.aone.google._json.id)
            expect(r.google._json.email).to.equal('airpairone001@gmail.com')
            expect(r.email).to.equal('airpairone001@gmail.com')
            done()


    it 'Google login for existing v1 user works after played with singup form', (done) ->
      db.ensureDoc 'User', data.users.samt, (e, samt) ->
        expect(samt.email).to.equal('san.thanki@gmail.com')
        expect(samt.google).to.exist
        expect(samt.googleId).to.equal('107929348314160277508')
        svcCtx = newUserSession('samt')
        svcCtx.session.anonData = { email: null }
        UserService.googleLogin.call svcCtx, data.oauth.samt.google, (ee,user) ->
          expect(user).to.exist
          db.readUser user._id, (e,r) ->
            expect(r.googleId).to.equal(data.oauth.samt.google._json.id)
            expect(r.google._json.email).to.equal("san.thanki@gmail.com")
            expect(r.email).to.equal("san.thanki@gmail.com")
            done()


    it 'Google login for existing v1 user doesnt blow up when tag not found', (done) ->
      db.ensureDoc 'User', data.users.bbe, (e, bbe) ->
        expect(bbe.email).to.equal('ben.beetle@gmail.com')
        expect(bbe.google).to.exist
        expect(bbe.googleId).to.equal('108341472603890720649')
        svcCtx = newUserSession('bbe')
        UserService.googleLogin.call svcCtx, data.oauth.bbe.google, (ee,user) ->
          expect(user).to.exist
          db.readUser user._id, (e,r) ->
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

    it.skip 'Change password as anonymous user logs user in'

    it 'Can request password change as anonymous user, and set a new local password', (done) ->
      new_password = 'sellsellsell'
      spy = sinon.spy(mailman,'sendChangePasswordEmail')
      SETUP.addLocalUser 'adap', {}, (userKey) ->
        adap = data.users[userKey]
        PUT '/users/me/password-change', {email: adap.email}, {}, ->
          expect(spy.callCount).to.equal(1)
          emailTo = spy.args[0][0]
          generated_hash = spy.args[0][1]
          expect(emailTo.email).to.equal(adap.email)
          expect(emailTo.name).to.equal(adap.name)
          expect(generated_hash).to.not.be.empty
          db.readUser adap._id, (eee,rrr) ->
            expect(rrr.local.changePasswordHash).to.equal(generated_hash)
            old_password_hash = rrr.local.password
            data = { hash: generated_hash, password: new_password }
            PUT "/users/me/password", data, {unauthenticated: true}, (s) ->
              UserService.localLogin.call newUserSession(), adap.email, new_password, (e,r) ->
                db.readUser adap._id, (e,r) ->
                  expect(r.local.password).to.exist
                  expect(old_password_hash).to.not.equal(r.local.password)
                  expect(r.local.changePasswordHash).to.be.empty
                  spy.restore()
                  done()


    it 'Can request a password change, and set a new local password', (done) ->
      new_password = 'drowssap'
      spy = sinon.spy(mailman,'sendChangePasswordEmail')
      SETUP.addAndLoginLocalUser 'prak', (d) ->
        db.readUser d._id, (eeee,rrrr) ->
          expect(rrrr.local.changePasswordHash).to.be.undefined
          PUT '/users/me/password-change', {email: d.email}, {}, ->
            expect(spy.callCount).to.equal(1)
            emailTo = spy.args[0][0]
            generated_hash = spy.args[0][1]
            expect(emailTo.email).to.equal(d.email)
            expect(emailTo.name).to.equal(d.name)
            expect(generated_hash).to.not.be.empty
            db.readUser d._id, (e,r) ->
              expect(r.local.changePasswordHash).to.equal(generated_hash)
              old_password_hash = r.local.password
              data = { hash: generated_hash, password: new_password }
              PUT "/users/me/password", data, {unauthenticated: true}, (s) ->
                UserService.localLogin.call newUserSession(), d.email, new_password, (e,r) ->
                  if (e) then return done(e)
                  db.readUser d._id, (e,r) ->
                    if (e) then return done(e)
                    expect(r.local.password).to.exist
                    expect(old_password_hash).to.not.equal(r.local.password)
                    expect(r.local.changePasswordHash).to.be.empty
                    spy.restore()
                    done()


    it 'Can try to request password change multiple, and set a new local password', (done) ->
      new_password = 'chessmac'
      spy = sinon.spy(mailman,'sendChangePasswordEmail')
      SETUP.addAndLoginLocalUser 'arys', (user) ->
        db.readUser user._id, (eeee,rrrr) ->
          expect(rrrr.local.changePasswordHash).to.be.undefined
          PUT '/users/me/password-change', {email: user.email}, {}, ->
            expect(spy.callCount).to.equal(1)
            emailTo = spy.args[0][0]
            generated_hash = spy.args[0][1]
            expect(emailTo.email).to.equal(user.email)
            expect(emailTo.name).to.equal(user.name)
            expect(generated_hash).to.not.be.empty
            # $log('generated_hash', generated_hash)
            db.readUser user._id, (eee,rrr) ->
              expect(rrr.local.changePasswordHash).to.equal(generated_hash)
              PUT '/users/me/password-change', {email: user.email}, {}, ->
                expect(spy.callCount).to.equal(2)
                emailTo2 = spy.args[1][0]
                generated_hash2 = spy.args[1][1]
                expect(emailTo2.email).to.equal(user.email)
                expect(emailTo2.name).to.equal(user.name)
                expect(generated_hash2).to.not.be.empty
                expect(generated_hash2).to.not.equal(generated_hash)
                # $log('generated_hash2', generated_hash2)
                db.readUser user._id, (ee,rr) ->
                  expect(rr.local.changePasswordHash).to.equal(generated_hash2)
                  data = { hash: generated_hash2, password: new_password }
                  # $log('data', data)
                  PUT "/users/me/password", data, {unauthenticated: true}, (s) ->
                    UserService.localLogin.call newUserSession(), user.email, new_password, (e,r) ->
                      db.readUser user._id, (eeeee,rrrrr) ->
                        expect(rrrrr.local.password).to.exist
                        expect(rrrrr.local.changePasswordHash).to.be.empty
                        spy.restore()
                        done()



    it 'must supply a valid email when requesting a password change', (done) ->
      SETUP.addAndLoginLocalUser 'stjp', (user) ->
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

    it 'Local user can change their email', (done) ->
      SETUP.addAndLoginLocalUserWithEmailVerified 'spgo', (s) ->
        expect(s.emailVerified).to.be.true
        the_new_email = "hello" + moment().format('x') + "@mydomain.com"
        PUT '/users/me/email', {email: the_new_email}, {}, ->
          GET '/session/full', {}, (s2) ->
            expect(s2.email).to.equal(the_new_email)
            expect(s2.emailVerified).to.be.false
            done()


    it 'Cannot change a users email to just any string', (done) ->
      the_new_email = "justsomestring"
      SETUP.addAndLoginLocalUserWithEmailVerified 'shan', (s) ->
        expect(s.emailVerified).to.be.true
        PUT '/users/me/email', {email: the_new_email}, {status:403}, (e)->
          expect(e.message).to.include('Invalid email address')
          done()


    it 'sending verify multiple times sends the same hash', (done) ->
      spy = sinon.spy(mailman,'sendVerifyEmail')
      SETUP.addAndLoginLocalUser 'chru', (uChru) ->
        PUT '/users/me/email', { email: uChru.email }, {}, (session) ->
          expect(session.emailVerified).to.be.false
          expect(spy.callCount).to.equal(1)
          hash1 = spy.args[0][1]
          expect(hash1).to.exist
          PUT '/users/me/email', { email: uChru.email }, {}, (session2) ->
            expect(session2.emailVerified).to.be.false
            expect(spy.callCount).to.equal(2)
            hash2 = spy.args[1][1]
            expect(hash2).to.exist
            expect(hash2).to.equal(hash1)
            PUT '/users/me/email', { email: uChru.email }, {}, (session3) ->
              expect(spy.callCount).to.equal(3)
              expect(spy.args[2][1]).to.equal(hash1)
              spy.restore()
              done()


    it 'Cannot change email with empty string', (done) ->
      SETUP.addAndLoginLocalUserWithEmailVerified 'scol', (s) ->
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
          expectStartsWith(err.message,'e-mail not verified')
          done()


    it 'user can only verify e-mail when logged in', (done) ->
      http(global.app)
        .put('/v1/api/users/me/email-verify')
        .send({hash:'yoyoy'})
        .expect(401)
        .end (err, res) ->
          if (err) then return done(err)
          done()


    it 'users can verify email for some features', (done) ->
      spy = sinon.spy(mailman,'sendVerifyEmail')
      SETUP.addAndLoginLocalUser 'stev', (s) ->
        POST '/requests', { type: 'troubleshooting', tags: [data.tags.node] }, {}, (r1) ->
          PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {status:403}, (rFail) ->
            expectStartsWith(rFail.message,'Email verification required')
            PUT '/users/me/email', { email: s.email }, {}, (s2) ->
              expect(spy.callCount).to.equal(1)
              hash = spy.args[0][1]
              spy.restore()
              PUT "/users/me/email-verify", { hash }, {}, (sVerified) ->
                expect(sVerified.emailVerified).to.be.true
                PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {}, (r2) ->
                  r2.experience = 'proficient'
                  done()


    it 'users can verify email for some features if logged in with google', (done) ->
      spy = sinon.spy(mailman,'sendVerifyEmail')
      db.ensureDoc 'User', data.users.narv, (e) ->
        LOGIN 'narv', data.users.narv, (snarv) ->
          POST '/requests', { type: 'troubleshooting', tags: [data.tags.node] }, {}, (r1) ->
            PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {status:403}, (rFail) ->
              expectStartsWith(rFail.message,'Email verification required')
              PUT '/users/me/email', { email: data.users.narv.email }, {}, (s2) ->
                expect(spy.callCount).to.equal(1)
                hash = spy.args[0][1]
                spy.restore()
                PUT "/users/me/email-verify", { hash }, {}, (sVerified) ->
                  expect(sVerified.emailVerified).to.be.true
                  PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {}, (r2) ->
                    r2.experience = 'proficient'
                    done()



    it 'google login can verify different email for some features if logged in with google', (done) ->
      spy = sinon.spy(mailman,'sendVerifyEmail')
      db.ensureDoc 'User', data.users.narv, (e) ->
        expect(data.users.narv.email).to.equal('vikram@freado.com')
        LOGIN 'narv', data.users.narv, (snarv) ->
          POST '/requests', { type: 'troubleshooting', tags: [data.tags.node] }, {}, (r1) ->
            PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {status:403}, (rFail) ->
              expectStartsWith(rFail.message,'Email verification required')
              PUT '/users/me/email', { email: "vikram@test.com" }, {}, (s2) ->
                # second put forces verify mode
                PUT '/users/me/email', { email: "vikram@test.com" }, {}, (s2) ->
                  expect(s2.emailVerified).to.be.false
                  expect(s2.email).to.equal("vikram@test.com")
                  expect(spy.callCount).to.equal(1)
                  expect(spy.args[0][0].email).to.equal("vikram@test.com")
                  hash = spy.args[0][1]
                  spy.restore()
                  PUT "/users/me/email-verify", { hash }, {}, (sVerified) ->
                    expect(sVerified.emailVerified).to.be.true
                    expect(sVerified.email).to.equal("vikram@test.com")
                    PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {}, (r2) ->
                      r2.experience = 'proficient'
                      done()


    it 'bad verification link does not verify the user', (done) ->
      SETUP.addAndLoginLocalUser 'step', (s) ->
        fakeHash = 'ABCDEF1234567'
        PUT "/users/me/email-verify", { hash: fakeHash }, { status: 400 }, (r) ->
          expectStartsWith(r.message,"e-mail verification failed")
          done()



describe "With analytics: ", ->


  it 'New user has correct cohort information', (done) ->
    checkCohort = (userId) ->
      ->
        db.readUser userId, (e,r) ->
          {cohort} = r
          expect(moment(cohort.engagement.visit_first).unix()).to.equal(moment(cookieCreatedAt).unix())
          expect(cohort.engagement.visit_signup).to.be.exist
          expect(cohort.engagement.visit_last).to.be.exist
          expect(cohort.engagement.visit_last).to.be.exist
          expect(cohort.firstRequest).to.exist
          expect(moment(cohort.engagement.visits[0]).unix()).to.equal(moment(util.dateWithDayAccuracy()).unix())
          expect(cohort.aliases.length).to.equal(1)
          # expect(cohort.aliases[0].indexOf("testdysn")).to.equal(0)
          done()

    clone = getNewUserData('dysn')
    ANONSESSION (r) ->
      GETP('/').end (e, rr) ->
        # $log 'page', page
        http(global.app).post('/v1/auth/signup').send(clone)
        .set('cookie',cookie)
        .end (err, resp) ->
          newUser = resp.body
          setTimeout checkCohort(newUser._id), 50
