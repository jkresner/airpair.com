IT 'Got cohort data', ->

  ANONSESSION ({sessionID}) =>
    expect(sessionID.length).to.equal(32)
    PAGE '/login', {}, (loginHTML) =>
      expect(loginHTML).contains("\"id\":\"#{sessionID}\"")
      SIGNUP 'dysn', (authd) =>
        expect(authd._id).to.exist
        UTIL.in 150, =>
          DB.docById 'User', authd._id, ({cohort}) =>
            {engagement,firstRequest,aliases} = cohort
            expect(aliases.length).to.equal(1)
            expect(aliases[0]).to.equal(sessionID)
            expect(engagement.visit_signup).to.exist
            expect(engagement.visit_last).to.exist
            expect(engagement.visit_last).to.exist
            EXPECT.equalMoments(engagement.visits[0], UTIL.Date.today())
            @todo('expect(firstRequest.url).to.exist')
            DONE()



# SKIP 'Can sign up as new user with local credentials', ->
#   d = DATA.newSignup('Steve Purves')
#   SUBMIT '/auth/signup', d, {}, (r) ->
#     expect(r._id).to.exist
#     expect(r.google).to.be.undefined
#     expect(r.googleId).to.be.undefined
#     expect(r.name).to.equal(d.name)
#     expect(r.email).to.equal(d.email)
#     expect(r.emailVerified).to.equal(false)
#     expect(r.auth).to.be.undefined  # holds password field
#     expect(r.roles).to.be.undefined # new users have undefined roles
#     expect(r.cohort.engagement).to.exist
#     GET '/auth/session', (s) ->
#       expect(s._id).to.exist
#       expect(s.avatar).to.exist
#       # expect(s.google).to.be.undefined
#       # expect(s.googleId).to.be.undefined
#       expect(s.name).to.equal(d.name)
#       expect(s.email).to.equal(d.email)
#       expect(s.emailVerified).to.equal(false)
#       expect(s.cohort.engagement).to.exist
#       expect(s.roles).to.be.undefined # new users have undefined roles
#       expect(s.auth).to.be.undefined # holds password field
#       # expect(s.auth.password).to.be.undefined
#       DB.docById 'User', s._id, (u) ->
#         EXPECT.equalIds(s._id, u._id)
#         expect(u.name).to.equal(s.name)
#         expect(u.auth).to.exist
#         expect(u.auth.password).to.exist
#         expect(u.emails.length).to.equal(1)
#         expect(u.emails[0].value).to.equal(d.email)
#         expect(u.emails[0].verified).to.equal(false)
#         expect(u.emails[0].primary).to.equal(true)
#         expect(u.emails[0].lists.length).to.equal(1)
#         DONE()



# SKIP 'Can sign up as new user with google (old format)', ->
#   profile = FIXTURE.clone('oauth.google_rbrw')._json
#   token = 'rbrw_token'
#   DB.removeDocs 'User', { 'auth.gp.id': FIXTURE.oauth.google_rbrw.id }, ->
#     AuthService.link.call DATA.newSession(), 'google', profile, {token}, (e,usr) ->
#       FIXTURE.users.rbrw = usr
#       LOGIN {key:'rbrw'}, (s0) ->
#         GET '/auth/session', (s) ->
#           expect(s._id).to.equal(usr._id.toString())
#           expect(s.email).to.equal(usr.email)
#           expect(s.name).to.equal(usr.name)
#           expect(s.roles).to.be.undefined  # new users have undefined roles
#           expect(s.cohort.engagement).to.exist
#           EXPECT.attr(s.auth.gp,'email')
#           # EXPECT.attr(s.auth.gp,'link')
#           # EXPECT.attrUndefined(s.auth.gp,'id')
#           DB.docById 'User', s._id, (u) ->
#             EXPECT.equalIds(s._id, u._id)
#             EXPECT.attr(u.auth.gp, 'id', String)
#             EXPECT.attr(u.auth.gp, 'email', String)
#             EXPECT.attr(u.auth.gp, 'link', String)
#             EXPECT.attrUndefined(u.auth.gp, 'locale')
#             expect(u.auth.gp.tokens[config.auth.appKey].token).to.equal('rbrw_token')
#             DONE()


# SKIP 'Can sign up as new user with google (new format)', ->
#   profile = FIXTURE.clone('oauth.google_aptst34')._json
#   token = 'aptst34_token'
#   DB.removeDocs 'User', { 'auth.gp.id': FIXTURE.oauth.google_aptst34.id }, ->
#     AuthService.link.call DATA.newSession(), 'google', profile, {token}, (e,usr) ->
#       FIXTURE.users.aptst34 = usr
#       LOGIN {key:'aptst34'}, (s0) ->
#         GET '/auth/session', (s) ->
#           expect(s._id).to.equal(usr._id.toString())
#           expect(s.email).to.equal(usr.email)
#           expect(s.name).to.equal(usr.name)
#           expect(s.roles).to.be.undefined  # new users have undefined roles
#           expect(s.cohort.engagement).to.exist
#           EXPECT.attr(s.auth.gp,'email')
#           # EXPECT.attrUndefined(s.auth.gp,'id')
#           DB.docById 'User', s._id, (u) ->
#             EXPECT.equalIds(s._id, u._id)
#             EXPECT.attr(u.auth.gp, 'id', String)
#             EXPECT.attr(u.auth.gp, 'email', String)
#             EXPECT.attrUndefined(u.auth.gp, 'locale')
#             expect(u.auth.gp.tokens[config.auth.appKey].token).to.equal('aptst34_token')
#             DONE()


# SKIP 'Cannot sign up with local credentials and existing gmail', ->
#   # DB.removeDocs 'User', qExists.byEmails(["experts@airpair.com"]), ->
#   #   d = name: "AirPair Experts", email: "experts@airpair.com", password: "Yoyoyoyoy"
#   #   DB.ensureDoc 'User', FIXTURE.users.apexperts, ->
#   #     SUBMIT '/auth/signup', d, {status:400, contentType: /json/ }, (err) ->
#   #       EXPECT.startsWith(err.message, 'Signup fail. Account with email already exists.')
#   #       DONE()


# SKIP 'Cannot sign up with local credentials and existing local email', ->
#   d = DATA.newSignup('James Jelinek')
#   SUBMIT '/auth/signup', d, {}, (r) ->
#     LOGOUT ->
#       SUBMIT '/auth/signup', d, {status:400}, (err) ->
#         EXPECT.startsWith(err.message, 'Signup fail. Account with email already exists.')
#         DONE()


# IT 'Fail gracefully to signup with github when user does not grant permission', ->
  # DB.removeDocs 'User', { 'auth.gh.id': FIXTURE.oauth.github_ludofleury.id }, ->
  #   profile = FIXTURE.oauth.github_ludofleury._json
  #   token = 'ludofleury_token'
  #   AuthService.link.call DATA.newSession(), 'github', profile, {token}, (e,usr) ->
  #     expect(e).to.be.null
  #     FIXTURE.users.ludofleury = usr
  #     LOGIN {key:'ludofleury'}, (s0) ->
  #       GET '/auth/session', (s) ->
  #         expect(s._id).to.equal(usr._id.toString())
  #         expect(s.email).to.equal(usr.email)
  #         expect(s.name).to.equal(usr.name)
  #         expect(s.cohort.engagement).to.exist
  #         EXPECT.attr(s.auth.gh,'username')
  #         # EXPECT.attrUndefined(s.auth.gp,'id')
  #         DB.docById 'User', s._id, (u) ->
  #           EXPECT.equalIds(s._id, u._id)
  #           EXPECT.attr(u.auth.gh, 'id', Number)
  #           EXPECT.attr(u.auth.gh, 'emails', Array)
  #           expect(u.auth.gh.tokens[config.auth.appKey].token).to.equal('ludofleury_token')
  #           DONE()

