# # changeEmail = ->

# #     # IT 'Local user can change their email', ->
# #     #   SETUP.addAndLoginLocalUserWithEmailVerified 'spgo', (s) ->
# #     #     expect(s.emailVerified).to.be.true
# #     #     the_new_email = "hello" + moment().format('x') + "@mydomain.com"
# #     #     PUT '/users/me/email', {email: the_new_email}, {}, ->
# #     #       GET '/session/full', {}, (s2) ->
# #     #         expect(s2.email).to.equal(the_new_email)
# #     #         expect(s2.emailVerified).to.be.false
# #     #         DONE()


# #     # IT 'Cannot change a users email to just any string', ->
# #     #   the_new_email = "justsomestring"
# #     #   SETUP.addAndLoginLocalUserWithEmailVerified 'shan', (s) ->
# #     #     expect(s.emailVerified).to.be.true
# #     #     PUT '/users/me/email', {email: the_new_email}, {status:403}, (e)->
# #     #       expect(e.message).to.include('Invalid email address')
# #     #       DONE()


# #     # IT 'sending verify multiple times sends the same hash', ->
# #     #   spy = sinon.spy(mailman,'sendTemplate')
# #     #   SETUP.addAndLoginLocalUser 'chru', (uChru) ->
# #     #     PUT '/users/me/email', { email: uChru.email }, {}, (session) ->
# #     #       expect(session.emailVerified).to.be.false
# #     #       expect(spy.callCount).to.equal(1)
# #     #       hash1 = spy.args[0][1].hash
# #     #       expect(hash1).to.exist
# #     #       PUT '/users/me/email', { email: uChru.email }, {}, (session2) ->
# #     #         expect(session2.emailVerified).to.be.false
# #     #         expect(spy.callCount).to.equal(2)
# #     #         hash2 = spy.args[1][1].hash
# #     #         expect(hash2).to.exist
# #     #         expect(hash2).to.equal(hash1)
# #     #         PUT '/users/me/email', { email: uChru.email }, {}, (session3) ->
# #     #           expect(spy.callCount).to.equal(3)
# #     #           expect(spy.args[2][1].hash).to.equal(hash1)
# #     #           spy.restore()
# #     #           DONE()


# #     # IT 'Cannot change email with empty string', ->
# #     #   SETUP.addAndLoginLocalUserWithEmailVerified 'scol', (s) ->
# #     #     expect(s.emailVerified).to.be.true
# #     #     PUT '/users/me/email', {}, {status:403}, (e)->
# #     #       expect(e.message).to.include('Invalid email address')
# #     #       DONE()


# #     # IT 'Cannot change email to an existing users email', ->
# #     #   SETUP.addAndLoginLocalUserWithEmailVerified 'scmo', (s) ->
# #     #     expect(s.emailVerified).to.be.true
# #     #     PUT '/users/me/email', {email:'ad@airpair.com'}, {status:400}, (e)->
# #     #       expect(e.message).to.include('Email belongs to another account')
# #     #       DONE()


# #     # IT.skip 'deny user if e-mail is not verified', ->
# #     #   d = getNewUserData('spur')
# #     #   SETUP.addAndLoginLocalUser 'spur', (userKey) ->
# #     #     GET '/billing/orders', { status: 403 }, (err) ->
# #     #       expectStartsWith(err.message,'e-mail not verified')
# #     #       DONE()


# #     # IT 'User can only verify e-mail when logged in', ->
# #     #   http(global.app)
# #     #     .put('/v1/api/users/me/email-verify')
# #     #     .send({hash:'yoyoy'})
# #     #     .expect(401)
# #     #     .end (err, res) ->
# #     #       if (err) then return DONE(err)
# #     #       DONE()


# #     # IT 'Users can verify email for some features', ->
# #     #   spy = sinon.spy(mailman,'sendTemplate')
# #     #   SETUP.addAndLoginLocalUser 'stev', (s) ->
# #     #     POST '/requests', { type: 'troubleshooting', tags: [data.tags.node] }, {}, (r1) ->
# #     #       PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {status:403}, (rFail) ->
# #     #         expectStartsWith(rFail.message,'Email verification required')
# #     #         PUT '/users/me/email', { email: s.email }, {}, (s2) ->
# #     #           expect(spy.callCount).to.equal(1)
# #     #           hash = spy.args[0][1].hash
# #     #           spy.restore()
# #     #           PUT "/users/me/email-verify", { hash }, {}, (sVerified) ->
# #     #             expect(sVerified.emailVerified).to.be.true
# #     #             PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {}, (r2) ->
# #     #               r2.experience = 'proficient'
# #     #               DONE()


# #     # IT 'users can verify email for some features if logged in with google', ->
# #     #   spy = sinon.spy(mailman,'sendTemplate')
# #     #   db.ensureDoc 'User', data.users.narv, (e) ->
# #     #     LOGIN 'narv', (snarv) ->
# #     #       POST '/requests', { type: 'troubleshooting', tags: [data.tags.node] }, {}, (r1) ->
# #     #         PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {status:403}, (rFail) ->
# #     #           expectStartsWith(rFail.message,'Email verification required')
# #     #           PUT '/users/me/email', { email: data.users.narv.email }, {}, (s2) ->
# #     #             expect(spy.callCount).to.equal(1)
# #     #             hash = spy.args[0][1].hash
# #     #             spy.restore()
# #     #             PUT "/users/me/email-verify", { hash }, {}, (sVerified) ->
# #     #               expect(sVerified.emailVerified).to.be.true
# #     #               PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {}, (r2) ->
# #     #                 r2.experience = 'proficient'
# #     #                 DONE()



# #     # IT 'Google login can verify different email for some features if logged in with google', ->
# #     #   spy = sinon.spy(mailman,'sendTemplate')
# #     #   db.ensureDoc 'User', data.users.narv, (e) ->
# #     #     expect(data.users.narv.email).to.equal('vikram@freado.com')
# #     #     LOGIN 'narv', (snarv) ->
# #     #       POST '/requests', { type: 'troubleshooting', tags: [data.tags.node] }, {}, (r1) ->
# #     #         PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {status:403}, (rFail) ->
# #     #           expectStartsWith(rFail.message,'Email verification required')
# #     #           PUT '/users/me/email', { email: "vikram@test.com" }, {}, (s2) ->
# #     #             # second put forces verify mode
# #     #             PUT '/users/me/email', { email: "vikram@test.com" }, {}, (s2) ->
# #     #               expect(s2.emailVerified).to.be.false
# #     #               expect(s2.email).to.equal("vikram@test.com")
# #     #               expect(spy.callCount).to.equal(1)
# #     #               expect(spy.args[0][2].email).to.equal("vikram@test.com")
# #     #               hash = spy.args[0][1].hash
# #     #               spy.restore()
# #     #               PUT "/users/me/email-verify", { hash }, {}, (sVerified) ->
# #     #                 expect(sVerified.emailVerified).to.be.true
# #     #                 expect(sVerified.email).to.equal("vikram@test.com")
# #     #                 PUT "/requests/#{r1._id}", _.extend(r1,{experience:'beginner'}), {}, (r2) ->
# #     #                   r2.experience = 'proficient'
# #     #                   DONE()


# #     # IT 'Bad verification link does not verify the user', ->
# #     #   SETUP.addAndLoginLocalUser 'step', (s) ->
# #     #     fakeHash = 'ABCDEF1234567'
# #     #     PUT "/users/me/email-verify", { hash: fakeHash }, { status: 400 }, (r) ->
# #     #       expectStartsWith(r.message,"e-mail verification failed")
# #     #       DONE()
