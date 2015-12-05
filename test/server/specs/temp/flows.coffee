signup = ->

  it 'Can signup from homepage and set password', itDone ->
    spy = sinon.spy(mailman,'sendTemplate')
    clone = DATA.newSignupData('mris')
    http(global.app).put('/v1/api/users/me/email')
      .send({email:clone.email}).expect(200)
      .end (err, resp) ->
        cookie = resp.headers['set-cookie']
        s1 = resp.body
        expect(s1.authenticated).to.be.false
        expect(s1.emailVerified).to.be.undefined
        expect(s1.sessionID).to.exist
        expect(s1.email).to.equal(clone.email)
        http(global.app).post('/v1/auth/signup-home')
          .send({email:s1.email,name:clone.name}).expect(200)
          .end (err2, resp2) ->
            s2 = resp2.body
            expect(s2.__v).to.be.undefined
            expect(s2._id).to.exist
            expect(s2.sessionID).to.be.undefined
            expect(s2.emailVerified).to.equal(false)
            expect(s2.name).to.equal(clone.name)
            expect(s2.email).to.equal(clone.email)
            expect(spy.callCount).to.equal(1)
            expect(spy.args[0][0]).to.equal('user-signup-nopass')
            emailTo = spy.args[0][2]
            set_password_hash = spy.args[0][1].hash
            expect(emailTo.email).to.equal(clone.email)
            expect(emailTo.name).to.equal(clone.name)
            expect(set_password_hash).to.not.be.empty
            spy.restore()
            PUT '/users/me/password', { hash: set_password_hash, password: clone.password }, {}, (s3) ->
              expect(s3._id).to.exist
              expect(s3.sessionID).to.be.undefined
              expect(s3.emailVerified).to.equal(true)
              expect(s3.name).to.equal(clone.name)
              expect(s3.email).to.equal(clone.email)
              ANONSESSION (sAnon) ->
                expect(sAnon.authenticated).to.equal(false)
                http(global.app).post('/v1/auth/login')
                  .send({email:clone.email,password:clone.password}).expect(200)
                  .end (err, resp) ->
                    s4 = resp.body
                    EXPECT.equalIds(s2._id,s4._id)
                    expect(s4.emailVerified).to.equal(true)
                    expect(s4.email).to.equal(clone.email)
                    cookie = resp.headers['set-cookie']
                    DONE()



  # it 'Can signup from post subscribe and set password', itDone ->
  #   spy = sinon.spy(mailman,'sendTemplate')
  #   clone = DATA.newSignupData('mirs')
  #   http(global.app).put('/v1/api/users/me/email')
  #     .send({email:clone.email}).expect(200)
  #     .end (err, resp) ->
  #       cookie = resp.headers['set-cookie']
  #       s1 = resp.body
  #       expect(s1.authenticated).to.be.false
  #       expect(s1.emailVerified).to.be.undefined
  #       expect(s1.sessionID).to.exist
  #       expect(s1.email).to.equal(clone.email)
  #       http(global.app).post('/v1/auth/subscribe')
  #         .send({email:s1.email,name:clone.name}).expect(200)
  #         .end (err2, resp2) ->
  #           s2 = resp2.body
  #           expect(s2._id).to.exist
  #           expect(s2.sessionID).to.be.undefined
  #           expect(s2.emailVerified).to.equal(false)
  #           expect(spy.callCount).to.equal(1)
  #           expect(spy.args[0][0]).to.equal('user-signup-nopass')
  #           set_password_hash = spy.args[0][1].hash
  #           emailTo = spy.args[0][2]
  #           expect(emailTo.email).to.equal(clone.email)
  #           expect(emailTo.name).to.equal(clone.name)
  #           expect(set_password_hash).to.not.be.empty
  #           spy.restore()
  #           PUT '/users/me/password', { hash: set_password_hash, password: clone.password }, {}, (s3) ->
  #             expect(s3._id).to.exist
  #             expect(s3.sessionID).to.be.undefined
  #             expect(s3.emailVerified).to.equal(true)
  #             expect(s3.name).to.equal(clone.name)
  #             expect(s3.email).to.equal(clone.email)
  #             ANONSESSION (sAnon) ->
  #               expect(sAnon.authenticated).to.equal(false)
  #               http(global.app).post('/v1/auth/login')
  #                 .send({email:clone.email,password:clone.password}).expect(200)
  #                 .end (err, resp) ->
  #                   s4 = resp.body
  #                   EXPECT.equalIds(s2._id,s4._id)
  #                   expect(s4.emailVerified).to.equal(true)
  #                   expect(s4.email).to.equal(clone.email)
  #                   cookie = resp.headers['set-cookie']
  #                   DONE()




module.exports = ->

  before -> STUB.analytics.on()

  describe("Signup: ".subspec, signup)
  describe("Dashboard: ".subspec, dashboard)
