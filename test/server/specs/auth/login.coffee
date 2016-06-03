before (done) ->
  DB.removeDocs 'User', email: { $in: ["deebarizo@gmail.com"] }, ->
    done()


IT 'sessionId on unauthenticated session', ->
  GET '/auth/session', { unauthenticated: true }, (s) ->
    expect(s.authenticated).to.be.false
    expect(s.sessionID).to.exist
    DONE()


IT 'Existing user login from new anon session adds new sessionID to aliases', ->
  key = FIXTURE.uniquify('users','ape1', 'email auth.gp.id auth.gh.id auth.gh.login')
  ape = FIXTURE.users[key]
  assign(ape.auth.gh.emails[0], {email:ape.email})
  DB.ensureDoc 'User', ape, (e, r0) ->
    LOGIN key, { unauthenticated: true }, (r1) ->
      EXPECT.equalIds(r1._id, ape._id)
      DB.docById 'User', r1._id, (r3) ->
        expect(r3.cohort.aliases.length).to.equal(2)
        DONE()


IT 'GH login no duplicate key error with existing gp profile', ->
  deebarizo = FIXTURE.clone('users.deebarizo')
  {gh} = deebarizo.auth
  delete deebarizo.auth.gh
  expect(deebarizo.auth.gh).to.be.undefined
  DB.ensureDoc 'User', deebarizo, (e, uDB) ->
    EXPECT.equalIdAttrs(deebarizo, uDB)
    expect(uDB.auth.gp.email).to.equal("deebarizo@gmail.com")
    expect(uDB.auth.gh).to.be.undefined
    LOGIN 'deebarizo', (s1) ->
      EXPECT.equalIdAttrs(uDB, s1)
      expect(s1.avatar).to.equal(gh.avatar_url)
      expect(s1.username).to.equal(gh.login)
      DB.docById 'User', deebarizo._id, (uDB2) ->
        expect(uDB2.auth.gp.email).to.equal("deebarizo@gmail.com")
        expect(uDB2.auth.gh.emails[0].email).to.equal("deebarizo@gmail.com")
        expect(uDB2.email).to.equal("deebarizo@gmail.com")
        DONE()


IT 'GH login of existing user has avatar for session', ->
  darkangel = FIXTURE.clone('users.darkangel')
  DB.ensureDoc 'User', darkangel, (e, uDB) ->
    EXPECT.equalIdAttrs(darkangel, uDB)
    expect(uDB.auth.gp.email).to.equal("darkangel51@gmail.com")
    expect(uDB.auth.gh.emails[0].email).to.equal("caguilar@dwdandsolutions.com")
    LOGIN 'darkangel', (s1) ->
      EXPECT.equalIdAttrs(uDB, s1)
      expect(s1.avatar).to.equal(darkangel.auth.gh.avatar_url)
      DB.docById 'User', darkangel._id, (uDB2) ->
        expect(uDB2.auth.gp.email).to.equal("darkangel51@gmail.com")
        expect(uDB2.auth.gh.emails[0].email).to.equal("caguilar@dwdandsolutions.com")
        expect(uDB2.email).to.equal("darkangel51@gmail.com")
        DONE()


IT 'GH login of existing user has avatar for session', ->
  darkangel = FIXTURE.clone('users.darkangel')
  DB.ensureDoc 'User', darkangel, (e, uDB) ->
    EXPECT.equalIdAttrs(darkangel, uDB)
    expect(uDB.auth.gp.email).to.equal("darkangel51@gmail.com")
    expect(uDB.auth.gh.emails[0].email).to.equal("caguilar@dwdandsolutions.com")
    LOGIN 'darkangel', (s1) ->
      EXPECT.equalIdAttrs(uDB, s1)
      expect(s1.avatar).to.equal(darkangel.auth.gh.avatar_url)
      DB.docById 'User', darkangel._id, (uDB2) ->
        expect(uDB2.auth.gp.email).to.equal("darkangel51@gmail.com")
        expect(uDB2.auth.gh.emails[0].email).to.equal("caguilar@dwdandsolutions.com")
        expect(uDB2.email).to.equal("darkangel51@gmail.com")
        DONE()


IT 'Logout authd', ->
  stpv = FIXTURE.clone('users.stpv')
  DB.ensureDoc 'User', stpv, (e, uDB) ->
    LOGIN 'stpv', (s1) ->
      EXPECT.equalIdAttrs(stpv, s1)
      PAGE '/auth/logout', {status:302,contentType:/text/}, (txt) ->
        expect(txt).to.inc ['Found. Redirecting to /']
        DONE()

IT 'Logout anon', ->
  PAGE '/auth/logout', {status:302,contentType:/text/}, (txt) ->
    expect(txt).to.inc ['Found. Redirecting to /']
    DONE()

  # it 'github login links to accounts with email matching any other provider', ->
  # it 'github login saves all emails to user record', ->

  # SKIP 'Can signup with local credentials then login with google of same email', ->
    # profile = FIXTURE.clone('oauth.google_aone')._json
    # token = 'aone_token'
    # signup = email: 'airpairone001@gmail.com', name: 'AIr One', password: 'pass2'
    # DB.removeDocs 'User', { email:'airpairone001@gmail.com'}, ->
    #   # $log('signup'.white, signup)
    #   SUBMIT '/auth/signup', signup, {}, (s) ->
    #     expect(s._id).to.exist
    #     expect(s.email).to.equal('airpairone001@gmail.com')
    #     LOGOUT ->
    #       # $log('try oauth'.white, profile)
    #       AuthService.link.call DATA.newSession(), 'google', profile, {token}, (e, r) ->
    #         expect(e).to.be.null
    #         expect(r._id).to.exist
    #         EXPECT.equalIds(r._id, s._id)
    #         DB.docById 'User', s._id, (r2) ->
    #           expect(r2.auth.gp.id).to.equal(FIXTURE.oauth.google_aone.id)
    #           expect(r2.email).to.equal('airpairone001@gmail.com')
    #           DONE()


  # SKIP 'Signup with google in one app and log back in with google in another', ->
  #   ape1 = FIXTURE.clone('users.ape1')
  #   profile = ape1.auth.gp
  #   token = 'ape1_gp_test_token'
  #   DB.removeDocs 'User', DATA.QUERY.users.byEmails(['airpairtest1@gmail.com']), ->
  #     DB.ensureDoc 'User', ape1, ->
  #       AuthService.link.call DATA.newSession(), 'google', profile, {token}, (e, r1) ->
  #         expect(e).to.be.null
  #         EXPECT.equalIds(r1._id, ape1._id)
  #         AuthService.link.call {user:r1}, 'google', profile, {token}, (e, r2) ->
  #           EXPECT.equalIds(r2._id, ape1._id)
  #           DB.docById 'User', ape1._id, (r3) ->
  #             expect(r3.auth.gp.id).to.equal(profile.id)
  #             expect(config.auth.appKey).to.equal('apcom')
  #             expect(r3.auth.gp.tokens['apcom'].token).to.equal('ape1_gp_test_token')
  #             expect(r3.auth.gp.tokens['consult'].token).to.equal(ape1.auth.gp.tokens['consult'].token)
  #             expect(r3.auth.gh.tokens['consult'].token).to.equal(ape1.auth.gh.tokens['consult'].token)
  #             expect(r3.auth.gh.tokens['apcom']).to.be.undefined
  #             DONE()


  # it 'Github signup can add password and login with email/password'


  # it 'Signup / login always uses lowercase and handles mixed-case input'
#   # IT 'Signup / login always uses lowercase and handles mixed-case input', ->
#   #   akumD = DATA.newSignup('"Ash Kumar"')
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
#   #         GET "/auth/session", (s) ->
#   #           EXPECT.startsWith(s.name, "Ash Kumar")
#   #         # svcCtx = DATA.newSession('akum')
#   #         # AuthService.googleLogin.call svcCtx, akumD_google, (ee,user) ->
#   #           # EXPECT.equalIds(user._id,resp2.body._id)
#   #           # expect(user.google).to.exist
#   #           # expect(user.email).to.equal(lower)
#   #           DONE()




  # it 'Login from existing anonymous session leaves aliases as is'


# password = ->

#   SKIP 'Request password change as anonymous user, and set a new password', ->
#     spy = STUB.spy(mailman,'sendTemplate')
#     STORY.newUser 'kelf', { login:false }, (userKey) ->
#       user = FIXTURE.users[userKey]
#       SUBMIT '/auth/password-reset', {email:user.email}, (r0) ->
#         expect(spy.callCount).to.equal(1)
#         expect(spy.args[0][0]).to.equal('user-password-change')
#         emailTo = spy.args[0][2]
#         generated_hash = spy.args[0][1].hash
#         expect(emailTo.email).to.equal(user.email)
#         expect(emailTo.name).to.equal(user.name)
#         expect(generated_hash).to.not.be.empty
#         DB.docById 'User', user._id, (rrr) ->
#           expect(rrr.auth).to.exist
#           expect(rrr.auth.password).to.exist
#           old_password = rrr.auth.password.value
#           new_password = 'sellsellsell'
#           expect(old_password!=new_password).to.be.true
#           GET "/auth/session", (s0) ->
#             expect(s0.authenticated is false).to.be.true
#             data = { email: user.email, hash: generated_hash, password: new_password }
#             SUBMIT "/auth/password-set", data, {}, (s) ->
#               GET "/auth/session", (s2) ->
#                 EXPECT.equalIds(s._id, s2._id)
#                 LOGOUT ->
#                   SUBMIT '/auth/login', {email:user.email,password:new_password}, {}, (s3) ->
#                     EXPECT.equalIds(s._id, s3._id)
#                     DONE()


#   SKIP 'Request a password change as authd user, and set a new password', ->
#     new_password = 'drowssap'
#     spy = STUB.spy(mailman,'sendTemplate')
#     STORY.newUser 'chri', (s) ->
#       DB.docById 'User', s._id, (rrrr) ->
#         expect(rrrr.auth.password.hash).to.exist
#         SUBMIT '/auth/password-reset', {email: s.email}, ->
#           expect(spy.callCount).to.equal(1)
#           expect(spy.args[0][0]).to.equal('user-password-change')
#           emailTo = spy.args[0][2]
#           reset_hash = spy.args[0][1].hash
#           expect(emailTo.email).to.equal(s.email)
#           expect(emailTo.name).to.equal(s.name)
#           expect(reset_hash).to.not.be.empty
#           DB.docById 'User', s._id, (rr) ->
#             expect(rrrr.auth.password.hash).to.equal(rr.auth.password.hash)
#             old_password_hash = rr.auth.password.hash
#             data = { email: s.email, hash: reset_hash, password: new_password }
#             SUBMIT "/auth/password-set", data, (s2) ->
#               LOGOUT ->
#                 SUBMIT '/auth/login', {email:s.email,password:new_password}, (s3) ->
#                   EXPECT.equalIds(s._id,s3._id)
#                   DONE()


#   it 'Try to request password change multiple, and set a new local password'
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
    #                 AuthService.localLogin.call DATA.newSession(), user.email, new_password, (e,r) ->
    #                   db.readDoc 'User', user._id, (rrrrr) ->
    #                     expect(r


  # it 'Must supply a valid email when requesting a password change'
# #   IT 'Must supply a valid email when requesting a password change', ->
# #     SUBMIT '/auth/password-reset', {email: "abc"}, { status: 403 }, (r) ->
# #       expect(r.message).to.include('Invalid email address')
# #       DONE()

  # it 'Cannot change local password to an short password'
# #   IT 'Cannot change local password to an short password', ->
# #     SUBMIT "/auth/password-set", {hash: "ABC", password:"abc"}, {status:403, unauthenticated: true}, (r) ->
# #       expect(r.message).to.include('Invalid password')
# #       DONE()

  # it 'Cannot change local password with any empty hash', ->
# #   IT 'Cannot change local password with any empty hash', ->
# #     SUBMIT "/auth/password-set", {hash: "", password:"newpassword"}, {status:403, unauthenticated: true}, (r) ->
# #       expect(r.message).to.include('Invalid hash')
# #       DONE()
