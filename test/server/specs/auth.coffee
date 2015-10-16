
signup = ->


  IT 'Can sign up as new user with local credentials', ->
    d = SETUP.usrData('Steve Purves')
    SUBMIT '/auth/signup', d, {}, (r) ->
      expect(r._id).to.exist
      expect(r.google).to.be.undefined
      expect(r.googleId).to.be.undefined
      expect(r.name).to.equal(d.name)
      expect(r.email).to.equal(d.email)
      expect(r.emailVerified).to.equal(false)
      expect(r.auth).to.be.undefined  # holds password field
      expect(r.roles).to.be.undefined # new users have undefined roles
      expect(r.cohort.engagement).to.exist
      GET '/session/full', (s) ->
        expect(s._id).to.exist
        expect(s.avatar).to.exist
        # expect(s.google).to.be.undefined
        # expect(s.googleId).to.be.undefined
        expect(s.name).to.equal(d.name)
        expect(s.email).to.equal(d.email)
        expect(s.emailVerified).to.equal(false)
        expect(s.cohort.engagement).to.exist
        expect(s.roles).to.be.undefined # new users have undefined roles
        expect(s.auth).to.be.undefined # holds password field
        # expect(s.auth.password).to.be.undefined
        DB.docById 'User', s._id, (u) ->
          expectIdsEqual(s._id, u._id)
          expect(u.name).to.equal(s.name)
          expect(u.auth).to.exist
          expect(u.auth.password).to.exist
          expect(u.emails.length).to.equal(1)
          expect(u.emails[0].value).to.equal(d.email)
          expect(u.emails[0].verified).to.equal(false)
          expect(u.emails[0].primary).to.equal(true)
          expect(u.emails[0].lists.length).to.equal(1)
          DONE()



  IT 'Can sign up as new user with google', ->
    DB.removeDocs 'User', { 'auth.gp.id': FIXTURE.oauth.google_rbrw.id }, ->
      profile = FIXTURE.oauth.google_rbrw._json
      token = 'rbrw_token'
      AuthService.link.call SETUP.userSession(), 'google', profile, {token}, (e,usr) ->
        FIXTURE.users.rbrw = usr
        LOGIN {key:'rbrw'}, (s0) ->
          GET '/session/full', (s) ->
            expect(s._id).to.equal(usr._id.toString())
            expect(s.email).to.equal(usr.email)
            expect(s.name).to.equal(usr.name)
            expect(s.roles).to.be.undefined  # new users have undefined roles
            expect(s.cohort.engagement).to.exist
            expectAttr(s.auth.gp,'email')
            expectAttr(s.auth.gp,'link')
            expectAttrUndefined(s.auth.gp,'id')
            DB.docById 'User', s._id, (u) ->
              expectIdsEqual(s._id, u._id)
              expectAttr(u.auth.gp, 'id', String)
              expectAttr(u.auth.gp, 'email', String)
              expectAttr(u.auth.gp, 'link', String)
              expectAttrUndefined(u.auth.gp, 'locale')
              expect(u.auth.gp.tokens[config.auth.oauth.appKey].token).to.equal('rbrw_token')
              DONE()


  IT 'Cannot sign up with local credentials and existing gmail', ->
    d = name: "AirPair Experts", email: "experts@airpair.com", password: "Yoyoyoyoy"
    DB.ensureDoc 'User', FIXTURE.users.apexperts, ->
      SUBMIT '/auth/signup', d, {status:400, contentType: /json/ }, (err) ->
        expectStartsWith(err.message, 'Signup fail. Account with email already exists.')
        DONE()


  IT 'Cannot sign up with local credentials and existing local email', ->
    d = SETUP.userData('jaje')
    SUBMIT '/auth/signup', d, {}, (r) ->
      LOGOUT ->
        SUBMIT '/auth/signup', d, {status:400}, (err) ->
          expectStartsWith(err.message, 'Signup fail. Account with email already exists.')
          DONE()


  it 'github login links to accounts with email matching any other provider', ->
  it 'github login saves all emails to user record', ->

  IT 'New user has correct cohort information', ->
    SETUP.analytics.on()
    checkCohort = (userId) ->
      ->
        DB.docById 'User', userId, (r) ->
          {cohort} = r
          expect(cohort.engagement.visit_signup).to.be.exist
          expect(cohort.engagement.visit_last).to.be.exist
          expect(cohort.engagement.visit_last).to.be.exist
          expectAttr(cohort.firstRequest, 'url', String)
          expect(moment(cohort.engagement.visits[0]).unix()).to.equal(moment(util.dateWithDayAccuracy()).unix())
          expect(cohort.aliases.length).to.equal(1)
          DB.docsByQuery 'Event', {uId:userId}, (r2) ->
            expect(r2.length).to.equal(1)
            SETUP.analytics.on()
            DONE()

    d = SETUP.usrData('Dilys sun')
    ANONSESSION (r) ->
      PAGE '/', {}, ->
        SUBMIT '/auth/signup', d, {}, (newUser) ->
          setTimeout checkCohort(ObjectId(newUser._id)), 150


login = ->

  before () -> SETUP.analytics.on()
  after () -> SETUP.analytics.off()


  IT 'Can signup with local credentials then login with google of same email', ->
    signup = email: 'airpairone001@gmail.com', name: 'AIr One', password: 'pass2'
    DB.removeDocs 'User', { email:'airpairone001@gmail.com'}, ->
      SUBMIT '/auth/signup', signup, {}, (s) ->
        expect(s._id).to.exist
        expect(s.email).to.equal('airpairone001@gmail.com')
        LOGOUT ->
          profile = FIXTURE.oauth.google_aone._json
          token = 'aone_token'
          AuthService.link.call SETUP.userSession(), 'google', profile, {token}, (e, r) ->
            expect(e).to.be.null
            expect(r._id).to.exist
            expectIdsEqual(r._id, s._id)
            DB.docById 'User', s._id, (r2) ->
              expect(r2.auth.gp.id).to.equal(FIXTURE.oauth.google_aone.id)
              expect(r2.email).to.equal('airpairone001@gmail.com')
              DONE()


  IT 'Signup with google in one app and log back in with google in another', ->
    {ape1} = FIXTURE.users
    DB.ensureDoc 'User', ape1, ->
      profile = ape1.auth.gp
      token = 'ape1_gp_test_token'
      AuthService.link.call SETUP.userSession(), 'google', profile, {token}, (e, r1) ->
        expectIdsEqual(r1._id, ape1._id)
        AuthService.link.call {user:r1}, 'google', profile, {token}, (e, r2) ->
          expectIdsEqual(r2._id, ape1._id)
          DB.docById 'User', ape1._id, (r3) ->
            expect(r3.auth.gp.id).to.equal(profile.id)
            expect(config.auth.oauth.appKey).to.equal('apcom')
            expect(r3.auth.gp.tokens['apcom'].token).to.equal('ape1_gp_test_token')
            expect(r3.auth.gp.tokens['consult'].token).to.equal(ape1.auth.gp.tokens['consult'].token)
            expect(r3.auth.gh.tokens['consult'].token).to.equal(ape1.auth.gh.tokens['consult'].token)
            expect(r3.auth.gh.tokens['apcom']).to.be.undefined
            DONE()


  it 'Github signup can add password and login with email/password'


  it 'Signup / login always uses lowercase and handles mixed-case input'
#   # IT 'Signup / login always uses lowercase and handles mixed-case input', ->
#   #   akumD = SETUP.userData('akum')
#   #   # akumD_google =
#   #   #   "provider" : "google",
#   #   #   "id" : "1999923803#{timeSeed()}",
#   #   #   "displayName" : "A Kumm",
#   #   #   "name" : { "familyName" : "AA", "givenName" : "Kumm" },
#   #   #   "emails" : [ {"value" : "admin@airpair.com" }],
#   #   #   "_json" :
#   #   #       "id" : "199992380360991119999",
#   #   #       "email" : akumD.email.toUpperCase(),
#   #   #       "name" : "AA Kumm",
#   #   #       "given_name" : "AA",
#   #   #       "family_name" : "Kum",
#   #   #       "link" : "https://plus.google.com/117132380360243205611",
#   #   #       "picture" : "https://lh3.googleusercontent.com/-NKYL9eK5Gis/AAAAAAAAAAI/AAAAAAAABKU/25K0BTOoa8c/photo.jpg",
#   #   #       "gender" : "male"
#   #   lower = akumD.email.toLowerCase()
#   #   akumD.email = akumD.email.toUpperCase()
#   #   SUBMIT '/v1/auth/signup', akumD, {}, (r) ->
#   #     expect(r.email).to.equal(lower)
#   #       # $log('r.email', akumD.email) ## login with caps email
#   #     LOGOUT ->
#   #       SUBMIT '/v1/auth/login', akumD, {}, (r2) ->
#   #         expect(r2._id).to.exist
#   #         GET "/session/full", (s) ->
#   #           expectStartsWith(s.name, "Ash Kumar")
#   #         # svcCtx = SETUP.userSession('akum')
#   #         # AuthService.googleLogin.call svcCtx, akumD_google, (ee,user) ->
#   #           # expectIdsEqual(user._id,resp2.body._id)
#   #           # expect(user.google).to.exist
#   #           # expect(user.email).to.equal(lower)
#   #           DONE()



  IT 'Login from a new anonymous session adds sessionID to aliases', ->
    SETUP.analytics.on()
    {ape1} = FIXTURE.users
    DB.ensureDoc 'User', ape1, ->
      profile = ape1.auth.gp
      token = 'ape1_gp_test_token'
      AuthService.link.call SETUP.userSession(), 'google', profile, {token}, (e, r1) ->
        expectIdsEqual(r1._id, ape1._id)
        DB.docById 'User', ape1._id, (r3) ->
          expect(r3.cohort.aliases.length).to.equal(2)
          DONE()


  it 'Login from existing anonymous session leaves aliases as is'


password = ->

  IT 'Request password change as anonymous user, and set a new password', ->
    spy = STUB.spy(mailman,'sendTemplate')
    STORY.newUser 'kelf', { login:false }, (userKey) ->
      user = FIXTURE.users[userKey]
      SUBMIT '/auth/password-reset', {email:user.email}, (r0) ->
        expect(spy.callCount).to.equal(1)
        expect(spy.args[0][0]).to.equal('user-password-change')
        emailTo = spy.args[0][2]
        generated_hash = spy.args[0][1].hash
        expect(emailTo.email).to.equal(user.email)
        expect(emailTo.name).to.equal(user.name)
        expect(generated_hash).to.not.be.empty
        DB.docById 'User', user._id, (rrr) ->
          expect(rrr.auth).to.exist
          expect(rrr.auth.password).to.exist
          old_password = rrr.auth.password.value
          new_password = 'sellsellsell'
          expect(old_password!=new_password).to.be.true
          GET "/session/full", (s0) ->
            expect(s0.authenticated is false).to.be.true
            data = { email: user.email, hash: generated_hash, password: new_password }
            SUBMIT "/auth/password-set", data, {}, (s) ->
              GET "/session/full", (s2) ->
                expectIdsEqual(s._id, s2._id)
                LOGOUT ->
                  SUBMIT '/auth/login', {email:user.email,password:new_password}, {}, (s3) ->
                    expectIdsEqual(s._id, s3._id)
                    DONE()


  IT 'Request a password change as authd user, and set a new password', ->
    new_password = 'drowssap'
    spy = STUB.spy(mailman,'sendTemplate')
    STORY.newUser 'chri', (s) ->
      DB.docById 'User', s._id, (rrrr) ->
        expect(rrrr.auth.password.hash).to.exist
        SUBMIT '/auth/password-reset', {email: s.email}, ->
          expect(spy.callCount).to.equal(1)
          expect(spy.args[0][0]).to.equal('user-password-change')
          emailTo = spy.args[0][2]
          reset_hash = spy.args[0][1].hash
          expect(emailTo.email).to.equal(s.email)
          expect(emailTo.name).to.equal(s.name)
          expect(reset_hash).to.not.be.empty
          DB.docById 'User', s._id, (rr) ->
            expect(rrrr.auth.password.hash).to.equal(rr.auth.password.hash)
            old_password_hash = rr.auth.password.hash
            data = { email: s.email, hash: reset_hash, password: new_password }
            SUBMIT "/auth/password-set", data, (s2) ->
              LOGOUT ->
                SUBMIT '/auth/login', {email:s.email,password:new_password}, (s3) ->
                  expectIdsEqual(s._id,s3._id)
                  DONE()


  it 'Try to request password change multiple, and set a new local password'
    #   new_password = 'chessmac'
    #   spy = sinon.spy(mailman,'sendTemplate')
    #   SETUP.addAndLoginLocalUser 'rpor', (user) ->
    #     db.readDoc 'User', user._id, (rrrr) ->
    #       expect(rrrr.local.changePasswordHash).to.be.undefined
    #       PUT '/users/me/password-change', {email: user.email}, {}, ->
    #         expect(spy.callCount).to.equrrrr.local.password).to.exist
    #                     expect(rrrrr.local.changePasswordHash).to.be.empty
    #                     spy.restore()
    #                     DONE()al(1)
    #         expect(spy.args[0][0]).to.equal('user-password-change')
    #         emailTo = spy.args[0][2]
    #         generated_hash = spy.args[0][1].hash
    #         expect(emailTo.email).to.equal(user.email)
    #         expect(emailTo.name).to.equal(user.name)
    #         expect(generated_hash).to.not.be.empty
    #         # $log('generated_hash', generated_hash)
    #         db.readDoc 'User', user._id, (rrr) ->
    #           expect(rrr.local.changePasswordHash).to.equal(generated_hash)
    #           PUT '/users/me/password-change', {email: user.email}, {}, ->
    #             expect(spy.callCount).to.equal(2)
    #             emailTo2 = spy.args[1][2]
    #             generated_hash2 = spy.args[1][1].hash
    #             expect(emailTo2.email).to.equal(user.email)
    #             expect(emailTo2.name).to.equal(user.name)
    #             expect(generated_hash2).to.not.be.empty
    #             expect(generated_hash2).to.not.equal(generated_hash)
    #             # $log('generated_hash2', generated_hash2)
    #             db.readDoc 'User', user._id, (rr) ->
    #               expect(rr.local.changePasswordHash).to.equal(generated_hash2)
    #               data = { hash: generated_hash2, password: new_password }
    #               # $log('data', data)
    #               PUT "/users/me/password", data, {unauthenticated: true}, (s) ->
    #                 AuthService.localLogin.call SETUP.userSession(), user.email, new_password, (e,r) ->
    #                   db.readDoc 'User', user._id, (rrrrr) ->
    #                     expect(r


  it 'Must supply a valid email when requesting a password change'
# #   IT 'Must supply a valid email when requesting a password change', ->
# #     SUBMIT '/auth/password-reset', {email: "abc"}, { status: 403 }, (r) ->
# #       expect(r.message).to.include('Invalid email address')
# #       DONE()

  it 'Cannot change local password to an short password'
# #   IT 'Cannot change local password to an short password', ->
# #     SUBMIT "/auth/password-set", {hash: "ABC", password:"abc"}, {status:403, unauthenticated: true}, (r) ->
# #       expect(r.message).to.include('Invalid password')
# #       DONE()

  it 'Cannot change local password with any empty hash', ->
# #   IT 'Cannot change local password with any empty hash', ->
# #     SUBMIT "/auth/password-set", {hash: "", password:"newpassword"}, {status:403, unauthenticated: true}, (r) ->
# #       expect(r.message).to.include('Invalid hash')
# #       DONE()




link = ->

  IT 'Link github with local user / password', ->
    STORY.newUser 'jkjk', (s) ->
      profile = FIXTURE.oauth.github_jk._json
      profile.id += parseInt(profile.id+timeSeed())
      token = 'jkjk_token'
      AuthService.link.call {user:s}, 'github', profile, {token}, (e,usr) ->
        FIXTURE.users[s.userKey] = usr
        GET '/session/full', (s1) ->
          expectIdsEqual(s._id, s1._id)
          expect(s1.auth.gh.username).to.be.undefined
          expect(s1.auth.gh.login).to.equal(profile.login)
          expect(s1.auth.gh.id).to.be.undefined
          DB.docById 'User', s._id, (r) ->
            expectAttr(r.auth.gh, 'id', Number)
            expect(r.auth.gh.id).to.equal(profile.id)
            expect(r.auth.gh.username).to.be.undefined
            expect(r.auth.gh.login).to.equal(profile.login)
            expect(r.auth.gh.following_url).to.be.undefined
            DONE()



module.exports = ->


  before (done) ->
    global.AuthService = require('../../../server/services/auth')
    done()


  after ->
    global.AuthService = undefined


  beforeEach ->
    STUB.sync(Wrappers.Slack, 'checkUserSync', null)
    STUB.cb(Wrappers.Slack, 'getUsers', FIXTURE.wrappers.slack_users_list)

  afterEach ->
    SETUP.analytics.off()


  describe "OLD", ->
    DESCRIBE("Signup", signup)
    DESCRIBE("Login", login)
    DESCRIBE("Password: ", password)
    DESCRIBE("LINK", link)

  # describe "NEW", ->
    # IT 'New github sign can return to old page', ->
