UserService = require('../../server/services/users')


signup = ->

  it 'Can sign up as new user with local credentials', itDone ->
    d =  SETUP.userData('jkap')

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
          DONE()


  it 'Can sign up as new user with google', itDone ->
    UserService.googleLogin.call SETUP.userSession(), data.oauth.rbrw, (e,usr) ->
      data.users.rbrw = usr
      LOGIN 'rbrw', ->
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
          DONE()


  it 'Cannot sign up with local credentials and existing gmail', itDone ->
    d = name: "AirPair Experts", email: "experts@airpair.com", password: "Yoyoyoyoy"

    UserService.googleLogin.call SETUP.userSession(), data.oauth.exap, (e,usr) ->
      data.users.exap = usr
      expect(usr._id).to.exist
      expect(usr.email).to.equal("experts@airpair.com")
      http(global.app).post('/v1/auth/signup').send(d)
        .expect(400)
        .expect('Content-Type', /json/)
        .end (err, res) ->
          if (err) then return done(err)
          expect(res.body.message).to.equal('Cannot signup, you previously created an account with your google login')
          DONE()


  it 'Cannot sign up with local credentials and existing local email', itDone ->
    d = SETUP.userData('jkap')
    http(global.app).post('/v1/auth/signup').send(d).expect(200)
      .end (e, r) ->
        http(global.app).post('/v1/auth/signup').send(d).expect(400)
          .end (err, res) ->
            if (err) then return done(err)
            expect(res.body.message).to.equal('Cannot signup, user already exists')
            DONE()



  it 'Can sign up via post comp', itDone ->
    d = _.pick(SETUP.userData('jkya'), ['name','email'])
    http(global.app).post('/v1/auth/signup-postcomp').send(d).expect(200)
      .end (e, resp) ->
        r = resp.body
        expect(r._id).to.exist
        expect(r.email).to.equal(d.email)
        DONE()


login = ->

  before () ->
    SETUP.analytics.on()

  it 'Login of existing v0 user creates cohort', itDone ->
    checkCohort = (_id) ->
      ->
        db.readDoc 'User', _id, (uRaw) ->
          # $log('uRaw', uRaw.cohort)
          expect(uRaw.cohort.maillists.length).to.equal(1)
          expect(uRaw.cohort.aliases.length).to.equal(1)
          expect(uRaw.cohort.aliases[0].indexOf('testSoumyaAcharya')).to.equal(0)
          SETUP.analytics.off()
          DONE()

    db.ensureDoc 'User', data.v0.users.SoumyaAcharya, (e, sou) ->
      expectIdsEqual(sou._id, "51a6668866a6f999a465f2fc")
      expect(sou.email).to.be.undefined
      expect(sou.name).to.be.undefined
      expect(sou.cohort.visit_first).to.be.undefined
      expect(sou.cohort.aliases.length).to.equal(0)
      session = SETUP.userSession('SoumyaAcharya')
      UserService.googleLogin.call session, sou.google, (ee,u) ->
        expect(u.email).to.equal(sou.google._json.email)
        expect(u.name).to.equal(sou.google.displayName)
        expect(u.emailVerified).to.be.false
        expect(u.cohort.aliases).to.be.undefined
        expect(u.cohort.engagement.visit_first).to.exist
        expect(moment(u.cohort.engagement.visit_signup).unix()).to.equal(moment(util.ObjectId2Date(sou._id)).unix())
        expect(u.cohort.engagement.visit_last).to.exists
        expect(u.cohort.engagement.visits.length).to.equal(1)
        expect(u.cohort.maillists).to.be.undefined
        setTimeout checkCohort(u._id), 50


  it 'Can signup with local credentials then login with google of same email', itDone ->
    db.ensureDoc 'User', data.users.aone, (e, aone) ->
      expect(aone.email).to.equal('airpairone001@gmail.com')
      expect(aone.google).to.be.undefined
      expect(aone.googleId).to.be.undefined
      UserService.googleLogin.call SETUP.userSession('aone'), data.oauth.aone.google, (ee,user) ->
        db.readDoc 'User', user._id, (r) ->
          expect(r.googleId).to.equal(data.oauth.aone.google._json.id)
          expect(r.google._json.email).to.equal('airpairone001@gmail.com')
          expect(r.email).to.equal('airpairone001@gmail.com')
          DONE()


  it 'Signup / login always uses lowercase and handles mixed-case input', itDone ->
    akumD = SETUP.userData('akum')
    akumD_google =
      "provider" : "google",
      "id" : "1999923803#{timeSeed()}",
      "displayName" : "A Kumm",
      "name" : { "familyName" : "AA", "givenName" : "Kumm" },
      "emails" : [ {"value" : "admin@airpair.com" }],
      "_json" :
          "id" : "199992380360991119999",
          "email" : akumD.email.toUpperCase(),
          "name" : "AA Kumm",
          "given_name" : "AA",
          "family_name" : "Kum",
          "link" : "https://plus.google.com/117132380360243205611",
          "picture" : "https://lh3.googleusercontent.com/-NKYL9eK5Gis/AAAAAAAAAAI/AAAAAAAABKU/25K0BTOoa8c/photo.jpg",
          "gender" : "male"
    lower = akumD.email.toLowerCase()
    akumD.email = akumD.email.toUpperCase()
    http(global.app).post('/v1/auth/signup').send(akumD).expect(200)
      .end (err, resp) ->
        if (err) then throw err
        expect(resp.body.email).to.equal(lower)
        # $log('r.email', akumD.email) ## login with caps email
        http(global.app).post('/v1/auth/login').send(akumD).expect(200)
        .end (err2, resp2) ->
          if (err) then throw err
          expect(resp2.body._id).to.exist
          svcCtx = SETUP.userSession('akum')
          UserService.googleLogin.call svcCtx, akumD_google, (ee,user) ->
            expectIdsEqual(user._id,resp2.body._id)
            expect(user.google).to.exist
            expect(user.email).to.equal(lower)
            DONE()


  it 'Google login for existing v1 user works after played with singup form', itDone ->
    db.ensureDoc 'User', data.users.samt, (e, samt) ->
      expect(samt.email).to.equal('san.thanki@gmail.com')
      expect(samt.google).to.exist
      expect(samt.googleId).to.equal('107929348314160277508')
      svcCtx = SETUP.userSession('samt')
      svcCtx.session.anonData = { email: null }
      UserService.googleLogin.call svcCtx, data.oauth.samt.google, (ee,user) ->
        expect(user).to.exist
        db.readDoc 'User', user._id, (r) ->
          expect(r.googleId).to.equal(data.oauth.samt.google._json.id)
          expect(r.google._json.email).to.equal("san.thanki@gmail.com")
          expect(r.email).to.equal("san.thanki@gmail.com")
          DONE()


  it 'Google login for existing v1 user doesnt blow up when tag not found', itDone ->
    db.ensureDoc 'User', data.users.bbe, (e, bbe) ->
      expect(bbe.email).to.equal('ben.beetle@gmail.com')
      expect(bbe.google).to.exist
      expect(bbe.googleId).to.equal('108341472603890720649')
      svcCtx = SETUP.userSession('bbe')
      UserService.googleLogin.call svcCtx, data.oauth.bbe.google, (ee,user) ->
        expect(user).to.exist
        db.readDoc 'User', user._id, (r) ->
          expect(r.googleId).to.equal(data.oauth.bbe.google._json.id)
          expect(r.google._json.email).to.equal('ben.beetle@gmail.com')
          expect(r.email).to.equal('ben.beetle@gmail.com')
          DONE()


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

password = ->

    it.skip 'Change password as anonymous user logs user in'

    it 'Request password change as anonymous user, and set a new local password', itDone ->
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
          db.readDoc 'User', adap._id, (rrr) ->
            expect(rrr.local.changePasswordHash).to.equal(generated_hash)
            old_password_hash = rrr.local.password
            data = { hash: generated_hash, password: new_password }
            PUT "/users/me/password", data, {unauthenticated: true}, (s) ->
              UserService.localLogin.call SETUP.userSession(), adap.email, new_password, (e,r) ->
                db.readDoc 'User', adap._id, (r) ->
                  expect(r.local.password).to.exist
                  expect(old_password_hash).to.not.equal(r.local.password)
                  expect(r.local.changePasswordHash).to.be.empty
                  spy.restore()
                  DONE()


    it 'Request a password change, and set a new local password', itDone ->
      new_password = 'drowssap'
      spy = sinon.spy(mailman,'sendChangePasswordEmail')
      SETUP.addAndLoginLocalUser 'prak', (d) ->
        db.readDoc 'User', ObjectId(d._id), (rrrr) ->
          expect(rrrr.local.changePasswordHash).to.be.undefined
          PUT '/users/me/password-change', {email: d.email}, {}, ->
            expect(spy.callCount).to.equal(1)
            emailTo = spy.args[0][0]
            generated_hash = spy.args[0][1]
            expect(emailTo.email).to.equal(d.email)
            expect(emailTo.name).to.equal(d.name)
            expect(generated_hash).to.not.be.empty
            db.readDoc 'User', d._id, (rr) ->
              expect(rr.local.changePasswordHash).to.equal(generated_hash)
              old_password_hash = rr.local.password
              data = { hash: generated_hash, password: new_password }
              PUT "/users/me/password", data, {unauthenticated: true}, (s) ->
                UserService.localLogin.call SETUP.userSession(), d.email, new_password, (e,r) ->
                  if (e) then return done(e)
                  db.readDoc 'User', d._id, (r) ->
                    if (e) then return done(e)
                    expect(r.local.password).to.exist
                    expect(old_password_hash).to.not.equal(r.local.password)
                    expect(r.local.changePasswordHash).to.be.empty
                    spy.restore()
                    DONE()


    it 'Try to request password change multiple, and set a new local password', itDone ->
      new_password = 'chessmac'
      spy = sinon.spy(mailman,'sendChangePasswordEmail')
      SETUP.addAndLoginLocalUser 'rpor', (user) ->
        db.readDoc 'User', user._id, (rrrr) ->
          expect(rrrr.local.changePasswordHash).to.be.undefined
          PUT '/users/me/password-change', {email: user.email}, {}, ->
            expect(spy.callCount).to.equal(1)
            emailTo = spy.args[0][0]
            generated_hash = spy.args[0][1]
            expect(emailTo.email).to.equal(user.email)
            expect(emailTo.name).to.equal(user.name)
            expect(generated_hash).to.not.be.empty
            # $log('generated_hash', generated_hash)
            db.readDoc 'User', user._id, (rrr) ->
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
                db.readDoc 'User', user._id, (rr) ->
                  expect(rr.local.changePasswordHash).to.equal(generated_hash2)
                  data = { hash: generated_hash2, password: new_password }
                  # $log('data', data)
                  PUT "/users/me/password", data, {unauthenticated: true}, (s) ->
                    UserService.localLogin.call SETUP.userSession(), user.email, new_password, (e,r) ->
                      db.readDoc 'User', user._id, (rrrrr) ->
                        expect(rrrrr.local.password).to.exist
                        expect(rrrrr.local.changePasswordHash).to.be.empty
                        spy.restore()
                        DONE()



    it 'Must supply a valid email when requesting a password change', itDone ->
      SETUP.addAndLoginLocalUser 'stjp', (user) ->
        PUT '/users/me/password-change', {email: "abc"}, { status: 403 }, (r) ->
          expect(r.message).to.include('Invalid email address')
          DONE()

    it 'Cannot change local password to an short password', itDone ->
      PUT "/users/me/password", {hash: "ABC", password:"abc"}, {status:403, unauthenticated: true}, (r) ->
        expect(r.message).to.include('Invalid password')
        DONE()

    it 'Cannot change local password with any empty hash', itDone ->
      PUT "/users/me/password", {hash: "", password:"newpassword"}, {status:403, unauthenticated: true}, (r) ->
        expect(r.message).to.include('Invalid hash')
        DONE()


changeEmail = ->

    it 'Local user can change their email', itDone ->
      SETUP.addAndLoginLocalUserWithEmailVerified 'spgo', (s) ->
        expect(s.emailVerified).to.be.true
        the_new_email = "hello" + moment().format('x') + "@mydomain.com"
        PUT '/users/me/email', {email: the_new_email}, {}, ->
          GET '/session/full', {}, (s2) ->
            expect(s2.email).to.equal(the_new_email)
            expect(s2.emailVerified).to.be.false
            DONE()


    it 'Cannot change a users email to just any string', itDone ->
      the_new_email = "justsomestring"
      SETUP.addAndLoginLocalUserWithEmailVerified 'shan', (s) ->
        expect(s.emailVerified).to.be.true
        PUT '/users/me/email', {email: the_new_email}, {status:403}, (e)->
          expect(e.message).to.include('Invalid email address')
          DONE()


    it 'sending verify multiple times sends the same hash', itDone ->
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
              DONE()


    it 'Cannot change email with empty string', itDone ->
      SETUP.addAndLoginLocalUserWithEmailVerified 'scol', (s) ->
        expect(s.emailVerified).to.be.true
        PUT '/users/me/email', {}, {status:403}, (e)->
          expect(e.message).to.include('Invalid email address')
          DONE()


    it 'Cannot change email to an existing users email', itDone ->
      SETUP.addAndLoginLocalUserWithEmailVerified 'scmo', (s) ->
        expect(s.emailVerified).to.be.true
        PUT '/users/me/email', {email:'ad@airpair.com'}, {status:400}, (e)->
          expect(e.message).to.include('Email belongs to another account')
          DONE()


    it.skip 'deny user if e-mail is not verified', itDone ->
      d = getNewUserData('spur')
      SETUP.addAndLoginLocalUser 'spur', (userKey) ->
        GET '/billing/orders', { status: 403 }, (err) ->
          expectStartsWith(err.message,'e-mail not verified')
          DONE()


    it 'User can only verify e-mail when logged in', itDone ->
      http(global.app)
        .put('/v1/api/users/me/email-verify')
        .send({hash:'yoyoy'})
        .expect(401)
        .end (err, res) ->
          if (err) then return DONE(err)
          DONE()


    it 'Users can verify email for some features', itDone ->
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
                  DONE()


    it 'users can verify email for some features if logged in with google', itDone ->
      spy = sinon.spy(mailman,'sendVerifyEmail')
      db.ensureDoc 'User', data.users.narv, (e) ->
        LOGIN 'narv', (snarv) ->
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
                    DONE()



    it 'Google login can verify different email for some features if logged in with google', itDone ->
      spy = sinon.spy(mailman,'sendVerifyEmail')
      db.ensureDoc 'User', data.users.narv, (e) ->
        expect(data.users.narv.email).to.equal('vikram@freado.com')
        LOGIN 'narv', (snarv) ->
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
                      DONE()


    it 'Bad verification link does not verify the user', itDone ->
      SETUP.addAndLoginLocalUser 'step', (s) ->
        fakeHash = 'ABCDEF1234567'
        PUT "/users/me/email-verify", { hash: fakeHash }, { status: 400 }, (r) ->
          expectStartsWith(r.message,"e-mail verification failed")
          DONE()



withAnalytics = ->

  before () ->
    SETUP.analytics.on()

  it 'New user has correct cohort information', itDone ->
    checkCohort = (userId) ->
      ->
        db.readDoc 'User', userId, (r) ->
          {cohort} = r
          expect(moment(cohort.engagement.visit_first).unix()).to.equal(moment(cookieCreatedAt).unix())
          expect(cohort.engagement.visit_signup).to.be.exist
          expect(cohort.engagement.visit_last).to.be.exist
          expect(cohort.engagement.visit_last).to.be.exist
          expect(cohort.firstRequest).to.exist
          expect(moment(cohort.engagement.visits[0]).unix()).to.equal(moment(util.dateWithDayAccuracy()).unix())
          expect(cohort.aliases.length).to.equal(1)
          # expect(cohort.aliases[0].indexOf("testdysn")).to.equal(0)
          DONE()

    clone = SETUP.userData('dysn')
    ANONSESSION (r) ->
      GETP('/').end (e, rr) ->
        # $log 'page', page
        http(global.app).post('/v1/auth/signup').send(clone)
        .set('cookie',cookie)
        .end (err, resp) ->
          newUser = resp.body
          setTimeout checkCohort(newUser._id), 50



module.exports = ->

  @timeout(6000)

  before (done) ->
    SETUP.initPosts done

  describe("Signup: ".subspec, signup)
  describe("Login: ".subspec, login)
  describe("Password: ".subspec, password)
  describe("Change and verify e-mail: ".subspec, changeEmail)
  describe("With analytics: ".subspec, withAnalytics)



