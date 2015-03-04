module.exports = -> describe "API", ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initTags ->
      SETUP.createNewExpert 'abha', {}, (s,exp) ->
        done()

  after ->
    SETUP.analytics.restore()


  it '401 for non authenticated request', (done) ->
    opts = status: 401
    d = type: 'mentoring', experience: 'beginner', brief: 'this is a test yo', hours: "1", time: 'rush', budget: 90
    POST '/requests', d, opts, ->
      done()


  it 'Cannot create request without a type', (done) ->
    addAndLoginLocalUser 'joba', (s) ->
      d = tags: [_.extend({sort:1}, data.tags.node)]
      POST '/requests', d, { status: 403 }, (r) ->
        expect(r.message).to.equal('Request type required')
        done()


  it 'Can start a request as logged in customer', (done) ->
    addAndLoginLocalUser 'josh', (s) ->
      d = type: 'mentoring'
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        expect(_.idsEqual(s._id,r.userId)).to.be.true
        expect(r.type).to.equal('mentoring')
        expect(r.tags.length).to.equal(0)
        expect(r.status).to.equal('received')
        expect(r.budget).to.be.undefined
        expect(r.lastTouch).to.be.undefined
        expect(r.adm).to.be.undefined
        expect(r.events).to.be.undefined
        LOGIN 'admin', data.users.admin, ->
          GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
            expect(rAdm.length).to.equal(1)
            expect(rAdm[0].suggested.length).to.equal(0)
            expect(rAdm[0].lastTouch).to.be.undefined
            expect(rAdm[0].adm).to.be.undefined
            done()


  it 'Cannot update a request without emailVerified', (done) ->
    addAndLoginLocalUser 'bhur', (s) ->
      expect(s.emailVerified).to.be.false
      d = type: 'code-review'
      POST '/requests', d, {}, (r1) ->
        expect(r1._id).to.exist
        r1.tags = [data.tags.node]
        PUT "/requests/#{r1._id}", r1, {}, (r2) ->
          expectIdsEqual(r1._id,r2._id)
          expect(r2.tags.length).to.equal(1)
          r2.experience = 'proficient'
          PUT "/requests/#{r1._id}", r2, {status:403}, (rFail) ->
            expect(rFail.message.indexOf("Email verification required")).to.equal(0)
            LOGIN 'admin', data.users.admin, ->
              GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
                expect(rAdm.length).to.equal(1)
                expect(rAdm[0].lastTouch).to.exist
                expect(rAdm[0].suggested.length).to.equal(0)
                expect(rAdm[0].adm).to.be.undefined
                done()


  it 'Can update request type with no technology tags', (done) ->
    addAndLoginLocalUser 'scol', (s) ->
      expect(s.emailVerified).to.be.false
      d = type: 'code-review'
      POST '/requests', d, {}, (r1) ->
        expect(r1._id).to.exist
        r1.type = 'mentoring'
        PUT "/requests/#{r1._id}", r1, {}, (r2) ->
          expectIdsEqual(r1._id,r2._id)
          expect(r2.type).to.equal('mentoring')
          done()


  it 'Can update a request after verifying email', (done) ->
    addAndLoginLocalUser 'narv', (s) ->
      expect(s.emailVerified).to.be.false
      d = type: 'troubleshooting', tags: [data.tags.node]
      POST '/requests', d, {}, (r1) ->
        spy = sinon.spy(mailman,'sendVerifyEmailForRequest')
        PUT "/requests/#{r1._id}/verify", {email:s.email}, {}, (v) ->
          expect(spy.callCount).to.equal(1)
          expect(spy.args[0][1]).to.exist
          spy.restore()
          expectIdsEqual(spy.args[0][2], r1._id)
          PUT '/users/me/email-verify', { hash: spy.args[0][1] }, {}, (s1) ->
            expect(s1.emailVerified).to.be.true
            r1.experience = 'proficient'
            PUT "/requests/#{r1._id}", r1, {}, (r2) ->
              expect(r2.experience).to.equal('proficient')
              LOGIN 'admin', data.users.admin, ->
                GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
                  expect(rAdm.length).to.equal(1)
                  expect(rAdm[0].lastTouch.utc).to.exist
                  expect(rAdm[0].lastTouch.action).to.equal('updateByCustomer')
                  expectStartsWith(rAdm[0].lastTouch.by.name,"Vikram Narayan")
                  expect(rAdm[0].adm.active).to.be.true
                  expect(rAdm[0].adm.submitted).to.be.undefined
                  done()


  it 'Can update a request after verify email if logged in with google', (done) ->
    testDb.ensureDoc 'User', data.users.narv, (e) ->
      LOGIN 'narv', data.users.narv, (snarv) ->
        d = type: 'troubleshooting', tags: [data.tags.node]
        POST '/requests', d, {}, (r1) ->
          spy = sinon.spy(mailman,'sendVerifyEmailForRequest')
          PUT "/requests/#{r1._id}/verify", {email:snarv.email}, {}, (v) ->
            expect(spy.callCount).to.equal(1)
            expect(spy.args[0][1]).to.exist
            spy.restore()
            expectIdsEqual(spy.args[0][2], r1._id)
            PUT '/users/me/email-verify', { hash: spy.args[0][1] }, {}, (s1) ->
              expect(s1.emailVerified).to.be.true
              r1.experience = 'proficient'
              PUT "/requests/#{r1._id}", r1, {}, (r2) ->
                expect(r2.experience).to.equal('proficient')
                done()


  it 'Can submit a full request with emailVerified', (done) ->
    addAndLoginLocalUserWithEmailVerified 'johb', (s) ->
      expect(s.emailVerified).to.be.true
      tag = _.extend({sort:1}, data.tags.node)
      all = tags: [tag], type: 'mentoring', experience: 'beginner', brief: 'this is a test yo', hours: "1", time: 'rush', budget: 90
      POST '/requests', {type:all.type}, {}, (r1) ->
        expect(r1._id).to.exist
        expect(r1.type).to.equal('mentoring')
        r1.tags = all.tags
        putUrl = "/requests/#{r1._id}"
        PUT putUrl, r1, {}, (r2) ->
          expect(r2.tags.length).to.equal(1)
          r2.experience = all.experience
          PUT putUrl, r2, {}, (r3) ->
            expect(r3.experience).to.equal(all.experience)
            r3.brief = all.brief
            PUT putUrl, r3, {}, (r4) ->
              expect(r4.brief).to.equal(all.brief)
              r4.hours = all.hours
              PUT putUrl, r4, {}, (r5) ->
                expect(r5.hours).to.equal(all.hours)
                r5.time = all.time
                PUT putUrl, r5, {}, (r6) ->
                  expect(r6.time).to.equal(all.time)
                  r6.budget = all.budget
                  PUT putUrl, r6, {}, (r7) ->
                    expect(r7.budget).to.equal(all.budget)
                    r7.title = 'A test title'
                    PUT putUrl, r7, {}, (r8) ->
                      expect(r8.title).to.equal('A test title')
                      LOGIN 'admin', data.users.admin, ->
                        GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
                          expect(rAdm.length).to.equal(1)
                          expect(rAdm[0].suggested.length).to.equal(0)
                          expect(rAdm[0].adm.active).to.be.true
                          expect(rAdm[0].adm.submitted).to.exist
                          expect(rAdm[0].adm.reviewable).to.be.undefined
                          done()


  it 'Can review a request as anon, customer and other', (done) ->
    addAndLoginLocalUserWithEmailVerified 'mfly', (s) ->
      d = tags: [data.tags.angular], type: 'troubleshooting', experience: 'advanced', brief: 'this is a another anglaur test yo', hours: "2", time: 'regular', budget: 150
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        GET "/requests/review/#{r._id}", {}, (rCustomer) ->
          expect(_.idsEqual(r._id,rCustomer._id)).to.be.true
          expect(rCustomer.type).to.equal('troubleshooting')
          expect(rCustomer.budget).to.equal(150)
          expect(rCustomer.suggested.length).to.equal(0)
          global.cookie = null
          GET "/requests/review/#{r._id}", {}, (rAnon) ->
            expect(_.idsEqual(r._id,rAnon._id)).to.be.true
            expect(rAnon.type).to.equal('troubleshooting')
            expect(rAnon.tags.length).to.equal(1)
            expect(rAnon.brief).to.equal('this is a another anglaur test yo')
            expect(rAnon.by.avatar).to.exist
            expect(rAnon.by.name).to.be.undefined
            expect(rAnon.userId).to.be.undefined
            expect(rAnon.budget).to.be.undefined
            expect(rAnon.suggested).to.be.undefined
            expect(rAnon.hours).to.be.undefined
            LOGIN 'abha', data.users.abha, (sAbha) ->
              expect(sAbha.name).to.equal('Abe Haskins')
              GET "/requests/review/#{r._id}", {}, (rExpert) ->
                expect(_.idsEqual(r._id,rExpert._id)).to.be.true
                expect(rExpert.by.name.indexOf("Michael Flynn")).to.equal(0)
                expect(rAnon.userId).to.be.undefined
                expect(rAnon.budget).to.be.undefined
                done()


  it 'Can self suggest reply to a request as an expert', (done) ->
    addAndLoginLocalUserWithEmailVerified 'mfln', (s) ->
      d = tags: [data.tags.angular], type: 'code-review', experience: 'advanced', brief: 'another anglaur test yo3', hours: "5", time: 'regular'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget:150,title:'test test'}), {}, (r) ->
          expect(r.status).to.equal('received')
          expect(r.suggested.length).to.equal(0)
          expect(r.adm).to.be.undefined
          LOGIN 'abha', data.users.abha, (sAbha) ->
            GET "/requests/review/#{r._id}", {}, (rAbha) ->
              expect(rAbha.adm).to.be.undefined
              expect(rAbha.status).to.equal('received')
              expect(rAbha.tags.length).to.equal(1)
              expect(rAbha.brief).to.exist
              expect(rAbha.suggested.length).to.equal(1)
              expect(rAbha.suggested[0].expert.minRate).to.equal(70)
              expect(rAbha.suggested[0].expert.email).to.equal("abeisgreat@abeisgreat.com")
              expect(rAbha.suggested[0].suggestedRate.expert).to.equal(113)
              expect(rAbha.suggested[0].suggestedRate.total).to.equal(146)
              reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
              customerMailSpy = sinon.spy(mailman, 'sendExpertAvailable')
              PUT "/requests/#{r._id}/reply/#{rAbha.suggested[0].expert._id}", reply, {}, (r1) ->
                expect(r1.status).to.equal('review')
                expect(r1.suggested.length).to.equal(1)
                expect(r1.suggested[0]._id).to.exist
                expect(r1.suggested[0].expertStatus).to.equal("available")
                expect(r1.suggested[0].expertComment).to.equal("I'll take it")
                expect(r1.suggested[0].expertAvailability).to.equal("Real-time")
                expect(_.idsEqual(sAbha._id,r1.suggested[0].expert.userId)).to.be.true
                expect(r1.suggested[0].expert.name).to.equal("Abe Haskins")
                expect(r1.suggested[0].expert.gh.username).to.equal("abeisgreat")
                expect(r1.suggested[0].expert.in.id).to.equal("2LZ2W07M-3")
                expect(r1.suggested[0].expert.so.link).to.equal("1570248/abeisgreat")
                expect(r1.suggested[0].expert.tw.username).to.equal("abeisgreat")
                expect(r1.suggested[0].expert.pic).to.be.undefined
                LOGIN 'admin', data.users.admin, ->
                  GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
                    expect(rAdm.length).to.equal(1)
                    expect(rAdm[0].lastTouch.utc).to.exist
                    expect(rAdm[0].lastTouch.action).to.equal('replyByExpert:available')
                    expect(rAdm[0].lastTouch.by.name.indexOf("Abe Haskins")).to.equal(0)
                    expect(rAdm[0].adm.active).to.be.true
                    expect(rAdm[0].adm.submitted).to.exist
                    expect(rAdm[0].adm.reviewable).to.exist
                    expect(customerMailSpy.callCount).to.equal(1)
                    expectStartsWith(customerMailSpy.args[0][0].name,"Michael Flynn")
                    expect(customerMailSpy.args[0][1]).to.equal("Abe Haskins")
                    expectIdsEqual(customerMailSpy.args[0][2],r1._id)
                    expect(customerMailSpy.args[0][3]).to.be.true
                    customerMailSpy.restore()
                    done()


  it 'Can update reply to a request as an expert', (done) ->
    addAndLoginLocalUserWithEmailVerified 'mikf', (s) ->
      d = tags: [data.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget:150}), {}, (r) ->
          expect(r.status).to.equal('received')
          expect(r.suggested.length).to.equal(0)
          LOGIN 'abha', data.users.abha, (sAbha) ->
            GET '/experts/me', {}, (eAbha) ->
              reply = expertComment: "I'm busy", expertAvailability: "Nah need a holiday", expertStatus: "busy"
              PUT "/requests/#{r._id}/reply/#{eAbha._id}", reply, {}, (r1) ->
                expect(r1.status).to.equal('received')
                expect(r1.suggested.length).to.equal(1)
                expect(r1.suggested[0]._id).to.exist
                expect(r1.suggested[0].expertStatus).to.equal("busy")
                expect(r1.suggested[0].expertAvailability).to.equal("Nah need a holiday")
                expect(r1.suggested[0].expertComment).to.equal("I'm busy")
                update = expertComment: "Actually I've got an hour", expertAvailability: "Now", expertStatus: "available"
                PUT "/requests/#{r._id}/reply/#{eAbha._id}", update, {}, (r2) ->
                  expect(r2.status).to.equal('review')
                  expect(r2.suggested.length).to.equal(1)
                  expect(_.idsEqual(r1.suggested[0]._id,r2.suggested[0]._id)).to.be.true
                  expect(r2.suggested[0].expertStatus).to.equal("available")
                  expect(r2.suggested[0].expertAvailability).to.equal("Now")
                  expect(r2.suggested[0].expertComment).to.equal("Actually I've got an hour")
                  expect(r2.suggested[0].reply.time).to.exist
                  done()


  it 'Double available reply does not trigger a second customer email', (done) ->
    addAndLoginLocalUserWithPayMethod 'brih', (sbrih) ->
      d = tags: [data.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget:300}), {}, (r) ->
          LOGIN 'abha', data.users.abha, (sAbha) ->
            GET "/requests/review/#{r._id}", {}, (rAbha) ->
              customerMailSpy = sinon.spy(mailman, 'sendExpertAvailable')
              reply = expertComment: "I'm available one", expertAvailability: "Yes", expertStatus: "available"
              PUT "/requests/#{r._id}/reply/#{rAbha.suggested[0].expert._id}", reply, {}, (r1) ->
                expect(r1.status).to.equal('review')
                update = expertComment: "Still available", expertAvailability: "Y", expertStatus: "available"
                PUT "/requests/#{r._id}/reply/#{rAbha.suggested[0].expert._id}", update, {}, (r2) ->
                  LOGIN 'admin', data.users.admin, ->
                    GET "/adm/requests/user/#{sbrih._id}", {}, (rAdm) ->
                      expect(rAdm.length).to.equal(1)
                      expect(rAdm[0].lastTouch.utc).to.exist
                      expect(rAdm[0].lastTouch.action).to.equal('replyByExpert:available')
                      expect(rAdm[0].lastTouch.by.name.indexOf("Abe Haskins")).to.equal(0)
                      expect(rAdm[0].adm.active).to.be.true
                      expect(rAdm[0].adm.reviewable).to.exist
                      expect(customerMailSpy.callCount).to.equal(1)
                      expectStartsWith(customerMailSpy.args[0][0].name,"Brian Hur")
                      expect(customerMailSpy.args[0][1]).to.equal("Abe Haskins")
                      expectIdsEqual(customerMailSpy.args[0][2],r._id)
                      expect(customerMailSpy.args[0][3]).to.be.false
                      customerMailSpy.restore()
                      done()


  it 'Can get data to book expert on request rate', (done) ->
    addAndLoginLocalUserWithEmailVerified 'pcor', (spcor) ->
      d = tags: [data.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget:300}), {}, (r) ->
          testNotAvailable = (callback) ->
            LOGIN 'abha', data.users.abha, (sAbha) ->
              GET "/requests/review/#{r._id}", {}, (rAbha) ->
                reply = expertComment: "I'm busy", expertAvailability: "Nah need a holiday", expertStatus: "busy"
                expertId = rAbha.suggested[0].expert._id
                PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r1) ->
                  expect(r1.status).to.equal('received')
                  LOGIN 'pcor', spcor, (sCustomer) ->
                    GET "/requests/#{r._id}/book/#{expertId}", { status: 400 }, (freview) ->
                      expect(freview.message.indexOf('No available expert')).to.equal(0)
                      callback()

          testAvailable = () ->
            LOGIN 'abha', data.users.abha, (sAbha) ->
              GET "/requests/review/#{r._id}", {}, (rAbha) ->
                reply = expertComment: "good", expertAvailability: "ok", expertStatus: "available"
                expertId = rAbha.suggested[0].expert._id
                PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r2) ->
                  expect(r2.status).to.equal('review')
                  LOGIN 'pcor', spcor, (sCustomer) ->
                    GET "/requests/#{r._id}/book/#{expertId}", {}, (review) ->
                      expect(review.status).to.equal('review')
                      expect(review.suggested.length).to.equal(1)
                      expect(_.idsEqual(review.suggested[0]._id,review.suggested[0]._id)).to.be.true
                      expect(review.suggested[0].suggestedRate).to.exist
                      expect(review.suggested[0].suggestedRate.expert).to.equal(158)
                      expect(review.suggested[0].suggestedRate.total).to.equal(236)
                      done()

          testNotAvailable testAvailable



  it.skip 'Cannot reply to customers own request', (done) ->
  it.skip 'Cannot reply to inactive request', (done) ->
  it.skip 'Cannot reply to overloaded request with 4 existing available replies', (done) ->


  it 'Can delete an incomplete request as owner', (done) ->
    addAndLoginLocalUser 'kyla', (s) ->
      d = type: 'mentoring'
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        DELETE "/requests/#{r._id}", {}, (rDel) ->
          GET "/requests", {}, (requests) ->
            expect(requests.length).to.equal(0)
            done()


  it 'Cannot delete a request unless owner or admin', (done) ->
    addAndLoginLocalUser 'kyau', (s) ->
      d = type: 'code-review'
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        addAndLoginLocalUser 'auka', (s2) ->
          DELETE "/requests/#{r._id}", { status: 403 }, (rDel) ->
            LOGIN 'admin', data.users.admin, (sAdmin) ->
              GET "/adm/requests/user/#{s._id}", {}, (reqs1) ->
                expect(reqs1.length).to.equal(1)
                DELETE "/requests/#{r._id}", {}, (rDel2) ->
                  GET "/adm/requests/user/#{s._id}", {}, (reqs2) ->
                    expect(reqs2.length).to.equal(0)
                    done()
