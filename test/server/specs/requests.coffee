
create = ->


  IT '401 for non authenticated request', ->
    d = type: 'mentoring', experience: 'beginner', brief: 'this is a test yo', hours: "1", time: 'rush', budget: 90
    POST '/requests', d, { status: 401 }, ->
      DONE()


  IT 'Cannot create request without a type', ->
    STORY.newUser 'joba', {login:true}, (s) ->
      d = tags: [_.extend({sort:1}, FIXTURE.tags.node)]
      POST '/requests', d, { status: 403 }, (r) ->
        expect(r.message).to.equal('Request type required')
        DONE()


  IT 'Can start a request as logged in customer', ->
    STORY.newUser 'josb', (s) ->
      d = type: 'mentoring'
      POST '/requests', d, (r) ->
        expect(r._id).to.exist
        expect(_.idsEqual(s._id,r.userId)).to.be.true
        expect(r.type).to.equal('mentoring')
        expect(r.tags.length).to.equal(0)
        expect(r.status).to.equal('received')
        expect(r.budget).to.be.undefined
        expect(r.lastTouch).to.be.undefined
        expect(r.adm).to.be.undefined
        expect(r.events).to.be.undefined
        LOGIN {key:'admin'}, ->
          GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
            expect(rAdm.length).to.equal(1)
            expect(rAdm[0].suggested.length).to.equal(0)
            expect(rAdm[0].lastTouch).to.be.undefined
            expect(rAdm[0].adm).to.be.undefined
            DONE()


  IT 'Can update request type with no technology tags', ->
    STORY.newUser 'scol', (s) ->
      d = type: 'code-review'
      POST '/requests', d, {}, (r1) ->
        expect(r1._id).to.exist
        r1.type = 'mentoring'
        PUT "/requests/#{r1._id}", r1, (r2) ->
          expectIdsEqual(r1._id,r2._id)
          expect(r2.type).to.equal('mentoring')
          DONE()


  IT 'Can update a request after verifying email', ->
    STORY.newUser 'narv', (s) ->
      # expect(s.emailVerified).to.be.false
      d = type: 'troubleshooting', tags: [FIXTURE.tags.node]
      POST '/requests', d, (r1) ->
        # spy = STUB.spy(mailman,'sendTemplate')
        # $log('r1', r1)
        # PUT "/requests/#{r1._id}/verify", {email:s.email}, {}, (v) ->
        # expect(spy.callCount).to.equal(1)
        # expect(spy.args[0][0]).to.equal('user-verify-email')
        # {hash} = spy.args[0][1]
        # expect(hash).to.exist
        # expectIdsEqual(spy.args[0][2], r1._id)
        # PUT '/users/me/email-verify', { hash }, {}, (s1) ->
          # expect(s1.emailVerified).to.be.true
        r1.experience = 'proficient'
        PUT "/requests/#{r1._id}", r1, (r2) ->
          expect(r2.experience).to.equal('proficient')
          LOGIN {key:'admin'}, ->
            GET "/adm/requests/user/#{s._id}", (rAdm) ->
              expect(rAdm.length).to.equal(1)
              expectTouch(rAdm[0].lastTouch, s._id, 'updateByCustomer')
              expect(rAdm[0].adm.active).to.be.true
              expect(rAdm[0].adm.submitted).to.be.undefined
              DONE()


  IT 'Submit a full request with emailVerified', ->
    STORY.newUser 'johb', (s) ->
      expect(s.emailVerified).to.be.true
      tag = _.extend({sort:1}, FIXTURE.tags.node)
      all = tags: [tag], type: 'mentoring', experience: 'beginner', brief: 'this is a test yo', hours: "1", time: 'rush', budget: 90
      POST '/requests', {type:all.type}, {}, (r1) ->
        expect(r1._id).to.exist
        expect(r1.type).to.equal('mentoring')
        r1.tags = all.tags
        putUrl = "/requests/#{r1._id}"
        PUT putUrl, r1, (r2) ->
          expect(r2.tags.length).to.equal(1)
          expect(r2.tags[0].slug).to.equal('node.js')
          expect(r2.tags[0].name).to.equal('Node.JS')
          expect(r2.tags[0].short).to.equal('Node')
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
                      LOGIN {key:'admin'}, ->
                        GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
                          expect(rAdm.length).to.equal(1)
                          expect(rAdm[0].suggested.length).to.equal(0)
                          expect(rAdm[0].adm.active).to.be.true
                          expect(rAdm[0].adm.submitted).to.exist
                          expect(rAdm[0].adm.reviewable).to.be.undefined
                          DONE()


  IT 'Delete an incomplete request as owner', ->
    STORY.newUser 'kyla', (s) ->
      d = type: 'mentoring'
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        DELETE "/requests/#{r._id}", {}, (rDel) ->
          GET "/requests", {}, (requests) ->
            expect(requests.length).to.equal(0)
            DONE()


  IT 'Cannot delete a request unless owner or admin', ->
    STORY.newUser 'kyau', (s) ->
      d = type: 'code-review'
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        STORY.newUser 'auka', (s2) ->
          DELETE "/requests/#{r._id}", { status: 403 }, (rDel) ->
            LOGIN {key:'admin'}, (sAdmin) ->
              GET "/adm/requests/user/#{s._id}", {}, (reqs1) ->
                expect(reqs1.length).to.equal(1)
                DELETE "/requests/#{r._id}", {}, (rDel2) ->
                  GET "/adm/requests/user/#{s._id}", {}, (reqs2) ->
                    expect(reqs2.length).to.equal(0)
                    DONE()


review = ->

  IT 'Review a request as anon, customer and other', ->
    STORY.newUser 'mfly', (s) ->
      d = tags: [FIXTURE.tags.angular], type: 'troubleshooting', experience: 'advanced', brief: 'this is a another anglaur test yo', hours: "2", time: 'regular', budget: 150
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        GET "/requests/review/#{r._id}", {}, (rCustomer) ->
          expect(_.idsEqual(r._id,rCustomer._id)).to.be.true
          expect(rCustomer.type).to.equal('troubleshooting')
          expect(rCustomer.budget).to.equal(150)
          expect(rCustomer.suggested.length).to.equal(0)
          LOGOUT ->
            GET "/requests/review/#{r._id}", (rAnon) ->
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
              LOGIN {key:'snug'}, (sSnug) ->
                expect(sSnug.name).to.equal("Ra'Shaun Stovall")
                GET "/requests/review/#{r._id}", {}, (rExpert) ->
                  expect(_.idsEqual(r._id,rExpert._id)).to.be.true
                  expect(rExpert.by.name.indexOf("Michael Flynn")).to.equal(0)
                  expect(rAnon.userId).to.be.undefined
                  expect(rAnon.budget).to.be.undefined
                  DONE()


  it 'Fail to review a request as v0 expert'
  # IT 'Fail to review a request as v0 expert', ->
  #   d = tags: [FIXTURE.tags.angular], type: 'code-review', experience: 'advanced', brief: 'another anglaur test yo3', hours: "5", time: 'regular'
  #   STORY.newRequest 'mify', {data:d}, (r) ->
  #     expect(FIXTURE.users.asv0.bio).to.be.undefined
  #     SETUP.ensureExpert 'asv0', ->
  #       LOGIN {key:'asv0'}, (sAsv0) ->
  #         GET "/requests/review/#{r._id}", {}, (rAsv0) ->
  #           expect(rAsv0.status).to.equal('received')
  #           seAsv0 = rAsv0.suggested[0].expert
  #           expectIdsEqual(seAsv0._id, FIXTURE.experts.asv0._id)
  #           expect(seAsv0.matching).to.be.undefined
  #           expect(seAsv0.activity).to.be.undefined
  #           expect(seAsv0.isV0).to.be.true
  #           reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
  #           PUT "/requests/#{r._id}/reply/#{seAsv0._id}", reply, { status: 403 }, (err) ->
  #             expectStartsWith(err.message, "Must migrate expert profile to reply")
  #             DONE()

  it 'Review a request as v0 expert after migration'
  # IT 'Review a request as v0 expert after migration', ->
  #   data = tags: [FIXTURE.tags.angular], type: 'code-review', experience: 'advanced', brief: 'another anglaur test yo3', hours: "5", time: 'regular'
  #   STORY.newRequest 'dsun', {data}, (r) ->
  #     SETUP.ensureExpert 'asv0', ->
  #       LOGIN {key:'asv0'}, (sAsv0) ->
  #         eData = rate: 120, initials: 'as', username: "asv0migrate#{timeSeed()}"
  #         STORY.applyToBeAnExpert eData, (eAsv1) ->
  #           GET "/requests/review/#{r._id}", (rAsv1) ->
  #             $log('rAsv1', rAsv1)
  #             expect(rAsv1.status).to.equal('received')
  #             seAsv1 = rAsv1.suggested[0].expert
  #             expectIdsEqual(seAsv1._id, FIXTURE.experts.asv0._id)
  #             expect(seAsv1.isV0).to.be.undefined
  #             expect(seAsv1.matching).to.be.undefined
  #             expect(seAsv1.activity).to.be.undefined
  #             reply = expertComment: "I will take it", expertAvailability: "Realest time", expertStatus: "available"
  #             PUT "/requests/#{r._id}/reply/#{eAsv1._id}", reply, (r1) ->
  #               expect(r1.status).to.equal('review')
  #               expect(r1.suggested.length).to.equal(1)
  #               expect(r1.suggested[0]._id).to.exist
  #               expect(r1.suggested[0].expertStatus).to.equal("available")
  #               expect(r1.suggested[0].expertComment).to.equal("I will take it")
  #               expect(r1.suggested[0].expertAvailability).to.equal("Realest time")
  #               expectIdsEqual(sAsv0._id,r1.suggested[0].expert.userId)
  #               expect(r1.suggested[0].expert.location).to.equal("Melbourne VIC, Australia")
  #               expect(r1.suggested[0].expert.timezone).to.equal("Australian Eastern Standard Time")
  #               expect(r1.suggested[0].expert.name).to.equal("Ashish Awaghad")
  #               expect(r1.suggested[0].expert.gh.username).to.equal("difficultashish")
  #               expect(r1.suggested[0].expert.in.id).to.equal("cDNFNcqq-z")
  #               expect(r1.suggested[0].expert.pic).to.be.undefined
  #               DB.docById 'Request', r._id, (rDB) ->
  #                 expect(rDB.user).to.be.undefined
  #                 DONE()


  it 'Self suggest reply to a request as a expert new expert'
#   it.skip 'Self suggest reply to a request as a expert new expert', ->
#     STORY.newUserWithEmailVerified 'mfln', (s) ->
#       d = tags: [FIXTURE.tags.angular], type: 'code-review', experience: 'advanced', brief: 'another anglaur test yo3', hours: "5", time: 'regular'
#       POST '/requests', d, {}, (r0) ->
#         PUT "/requests/#{r0._id}", _.extend(r0,{budget:150,title:'test test'}), {}, (r) ->
#           expect(r.status).to.equal('received')
#           expect(r.suggested.length).to.equal(0)
#           expect(r.adm).to.be.undefined
#           LOGIN abhaKey, (sAbha) ->
#             GET "/requests/review/#{r._id}", {}, (rAbha) ->
#               expect(rAbha.adm).to.be.undefined
#               expect(rAbha.status).to.equal('received')
#               expect(rAbha.tags.length).to.equal(1)
#               expect(rAbha.brief).to.exist
#               expect(rAbha.suggested.length).to.equal(1)
#               expect(rAbha.suggested[0].expert.minRate).to.equal(70)
#               expectStartsWith(rAbha.suggested[0].expert.email, "abeisgreat")
#               expect(rAbha.suggested[0].suggestedRate.expert).to.equal(85)
#               expect(rAbha.suggested[0].suggestedRate.total).to.equal(130)
#               reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
#               customerMailSpy = sinon.spy(mailman, 'sendTemplate')
#               PUT "/requests/#{r._id}/reply/#{rAbha.suggested[0].expert._id}", reply, {}, (r1) ->
#                 expect(r1.status).to.equal('review')
#                 expect(r1.suggested.length).to.equal(1)
#                 expect(r1.suggested[0]._id).to.exist
#                 expect(r1.suggested[0].expertStatus).to.equal("available")
#                 expect(r1.suggested[0].expertComment).to.equal("I'll take it")
#                 expect(r1.suggested[0].expertAvailability).to.equal("Real-time")
#                 expect(_.idsEqual(sAbha._id,r1.suggested[0].expert.userId)).to.be.true
#                 expect(r1.suggested[0].expert.location).to.exist
#                 expect(r1.suggested[0].expert.timezone).to.exist
#                 expect(r1.suggested[0].expert.name).to.equal("Abe Haskins")
#                 expect(r1.suggested[0].expert.gh.username).to.equal("airpairtest1")
#                 expect(r1.suggested[0].expert.in.id).to.equal("2LZ2W07M-3")
#                 expect(r1.suggested[0].expert.so.link).to.equal("1570248/abeisgreat")
#                 expect(r1.suggested[0].expert.tw.username).to.equal("abeisgreat")
#                 expect(r1.suggested[0].expert.pic).to.be.undefined
#                 LOGIN 'admin', ->
#                   GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
#                     expect(rAdm.length).to.equal(1)
#                     expect(rAdm[0].lastTouch.utc).to.exist
#                     expect(rAdm[0].lastTouch.action).to.equal('replyByExpert:available')
#                     expect(rAdm[0].lastTouch.by.name.indexOf("Abe Haskins")).to.equal(0)
#                     expect(rAdm[0].adm.active).to.be.true
#                     expect(rAdm[0].adm.submitted).to.exist
#                     expect(rAdm[0].adm.reviewable).to.exist
#                     $log('we got all the way here', customerMailSpy.callCount)
#                     expect(customerMailSpy.callCount).to.equal(1)
#                     expectStartsWith(customerMailSpy.args[0][0].name,"Michael Flynn")
#                     expect(customerMailSpy.args[0][1]).to.equal("Abe Haskins")
#                     expectIdsEqual(customerMailSpy.args[0][2],r1._id)
#                     expect(customerMailSpy.args[0][3]).to.be.true
#                     customerMailSpy.restore()
#                     DONE()



  IT 'Update reply to a request as an expert', ->
    STORY.newUser 'mikf', (s) ->
      d = tags: [FIXTURE.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget:150}), {}, (r) ->
          expect(r.status).to.equal('received')
          expect(r.suggested.length).to.equal(0)
          LOGIN {key:'snug'}, (sAbha) ->
            GET '/experts/me', (eAbha) ->
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
                  DONE()


  IT 'Double available reply does not trigger a second customer email', ->
    STORY.newUser 'brih', {login:true,paymethod:true,location:true}, (sbrih) ->
      d = tags: [FIXTURE.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget:300,title:'fnaaay'}), {}, (r) ->
          LOGIN {key:'snug'}, (sAbha) ->
            GET "/requests/review/#{r._id}", {}, (rAbha) ->
              customerMailSpy = sinon.spy(mailman, 'sendTemplate')
              reply = expertComment: "I'm available one", expertAvailability: "Yes", expertStatus: "available"
              PUT "/requests/#{r._id}/reply/#{rAbha.suggested[0].expert._id}", reply, (r1) ->
                expect(r1.status).to.equal('review')
                update = expertComment: "Still available", expertAvailability: "Y", expertStatus: "available"
                PUT "/requests/#{r._id}/reply/#{rAbha.suggested[0].expert._id}", update, (r2) ->
                  LOGIN {key:'admin'}, ->
                    GET "/adm/requests/user/#{sbrih._id}", {}, (rAdm) ->
                      expect(rAdm.length).to.equal(1)
                      expect(rAdm[0].lastTouch.utc).to.exist
                      expect(rAdm[0].lastTouch.action).to.equal('replyByExpert:available')
                      expect(rAdm[0].lastTouch.by.name.indexOf("Ra'Shaun Stovall")).to.equal(0)
                      expect(rAdm[0].adm.active).to.be.true
                      expect(rAdm[0].adm.reviewable).to.exist
                      expect(customerMailSpy.callCount).to.equal(3)
                      expect(customerMailSpy.args[0][0]).to.equal("pipeliner-notify-reply")
                      expect(customerMailSpy.args[1][0]).to.equal("expert-available")
                      expect(customerMailSpy.args[2][0]).to.equal("pipeliner-notify-reply")
                      expAvailArgs = customerMailSpy.args[1]
                      expect(expAvailArgs[1].expertName).to.equal("Ra'Shaun Stovall")
                      expectStartsWith(expAvailArgs[2].name,"Brian Hur")
                      expect(expAvailArgs[3]).to.be.undefined
                      customerMailSpy.restore()
                      DONE()


  IT 'Can get data to book expert on request rate', ->
    STORY.newUser 'pcor', (spcor, spcorKey) ->
      d = tags: [FIXTURE.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget:300}), (r) ->
          testNotAvailable = (callback) ->
            LOGIN {key:'snug'}, (sAbha) ->
              GET "/requests/review/#{r._id}", (rAbha) ->
                reply = expertComment: "I'm busy", expertAvailability: "Nah need a holiday", expertStatus: "busy"
                expertId = rAbha.suggested[0].expert._id
                PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r1) ->
                  expect(r1.status).to.equal('received')
                  LOGIN {key:spcorKey}, (sCustomer) ->
                    GET "/requests/#{r._id}/book/#{expertId}", { status: 400 }, (freview) ->
                      expectStartsWith(freview.message, 'No available expert')
                      callback()

          testAvailable = () ->
            LOGIN {key:'snug'}, (sAbha) ->
              GET "/requests/review/#{r._id}", {}, (rAbha) ->
                reply = expertComment: "good", expertAvailability: "ok", expertStatus: "available"
                expertId = rAbha.suggested[0].expert._id
                PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r2) ->
                  expect(r2.status).to.equal('review')
                  LOGIN {key:spcorKey}, (sCustomer) ->
                    GET "/requests/#{r._id}/book/#{expertId}", {}, (review) ->
                      expect(review.status).to.equal('review')
                      expect(review.suggested.length).to.equal(1)
                      expectIdsEqual(review.suggested[0].expert._id,expertId)
                      expect(review.suggested[0].suggestedRate).to.exist
                      expect(review.suggested[0].suggestedRate.expert).to.equal(155)
                      expect(review.suggested[0].suggestedRate.total).to.equal(240)
                      DONE()

          testNotAvailable testAvailable



#   IT 'Cannot reply to customers own request'

#   IT 'Cannot reply to inactive request'

#   IT 'Cannot reply to overloaded request with 4 existing available replies'



module.exports = ->

  before (done) ->
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
    SETUP.ensureExpert 'snug', ->
      done()

  beforeEach ->
    STUB.sync(Wrappers.Slack, 'checkUserSync', null)
    STUB.cb(Wrappers.Slack, 'getUsers', FIXTURE.wrappers.slack_users_list)
    STUB.cb(Wrappers.Slack, 'getChannels', FIXTURE.wrappers.slack_channels_list)
    STUB.cb(Wrappers.Slack, 'getGroups', FIXTURE.wrappers.slack_groups_list)


  DESCRIBE "Create", create
  DESCRIBE "Review", review
