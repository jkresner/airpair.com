
create = ->


  IT '403 for non authenticated request', ->
    d = type: 'mentoring', experience: 'beginner', brief: 'this is a test yo', hours: "1", time: 'rush', budget: 90
    POST '/requests', d, { status: 403 }, ->
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
        LOGIN 'admin', {retainSession:false}, ->
          GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
            expect(rAdm.length).to.equal(1)
            expect(rAdm[0].suggested.length).to.equal(0)
            expect(rAdm[0].lastTouch).to.be.undefined
            expect(rAdm[0].adm).to.be.undefined
            DONE()


  IT 'Can update request type with no technology tags', ->
    STORY.newUser 'uris', (s) ->
      d = type: 'code-review'
      POST '/requests', d, {}, (r1) ->
        expect(r1._id).to.exist
        r1.type = 'mentoring'
        PUT "/requests/#{r1._id}", r1, (r2) ->
          EXPECT.equalIds(r1._id,r2._id)
          expect(r2.type).to.equal('mentoring')
          DONE()


  IT 'Can update a request after verifying email', ->
    STORY.newUser 'nevk', (s) ->
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
        # EXPECT.equalIds(spy.args[0][2], r1._id)
        # PUT '/users/me/email-verify', { hash }, {}, (s1) ->
          # expect(s1.emailVerified).to.be.true
        r1.experience = 'proficient'
        PUT "/requests/#{r1._id}", r1, (r2) ->
          expect(r2.experience).to.equal('proficient')
          LOGIN 'admin', {retainSession:false}, ->
            GET "/adm/requests/user/#{s._id}", (rAdm) ->
              expect(rAdm.length).to.equal(1)
              EXPECT.touch(rAdm[0].lastTouch, s._id, 'updateByCustomer')
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
                      LOGIN 'admin', {retainSession:false}, ->
                        GET "/adm/requests/user/#{s._id}", {}, (rAdm) ->
                          expect(rAdm.length).to.equal(1)
                          expect(rAdm[0].suggested.length).to.equal(0)
                          expect(rAdm[0].adm.active).to.be.true
                          expect(rAdm[0].adm.submitted).to.exist
                          expect(rAdm[0].adm.reviewable).to.be.undefined
                          DONE()


  IT 'Delete an incomplete request as owner', ->
    STORY.newUser 'dily', (s) ->
      d = type: 'mentoring'
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        DELETE "/requests/#{r._id}", {}, (rDel) ->
          GET "/requests", {}, (requests) ->
            expect(requests.length).to.equal(0)
            DONE()


  SKIP 'Cannot delete a request unless owner or admin', ->
    STORY.newUser 'kyau', (s) ->
      d = type: 'code-review'
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        STORY.newUser 'clew', (s2) ->
          DELETE "/requests/#{r._id}", { status: 403 }, (rDel) ->
            LOGIN 'admin', {retainSession:false}, ->
              GET "/adm/requests/user/#{s._id}", {}, (reqs1) ->
                expect(reqs1.length).to.equal(1)
                DELETE "/requests/#{r._id}", {}, (rDel2) ->
                  GET "/adm/requests/user/#{s._id}", {}, (reqs2) ->
                    expect(reqs2.length).to.equal(0)
                    DONE()


review = ->

  IT 'Review a request as anon, customer and other', ->
    STORY.newUser 'soik', (s) ->
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
              LOGIN 'snug', {retainSession:false}, (sSnug) ->
                expect(sSnug.name).to.equal("Ra'Shaun Stovall")
                GET "/requests/review/#{r._id}", {}, (rExpert) ->
                  expect(_.idsEqual(r._id,rExpert._id)).to.be.true
                  expect(rExpert.by.name.indexOf("Somik Rana")).to.equal(0)
                  expect(rAnon.userId).to.be.undefined
                  expect(rAnon.budget).to.be.undefined
                  DONE()



  SKIP 'Can get data to book expert on request rate', ->
    STORY.newUser 'peco', (spcor, spcorKey) ->
      d = tags: [FIXTURE.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget:300}), (r) ->
          testNotAvailable = (callback) ->
            LOGIN 'snug', {retainSession:false}, (sAbha) ->
              GET "/requests/review/#{r._id}", (rAbha) ->
                reply = expertComment: "I'm busy", expertAvailability: "Nah need a holiday", expertStatus: "busy"
                expertId = rAbha.suggested[0].expert._id
                PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r1) ->
                  expect(r1.status).to.equal('received')
                  LOGIN {key:spcorKey}, (sCustomer) ->
                    GET "/requests/#{r._id}/book/#{expertId}", { status: 400 }, (freview) ->
                      EXPECT.startsWith(freview.message, 'No available expert')
                      callback()

          testAvailable = () ->
            LOGIN 'snug', {retainSession:false}, (sAbha) ->
              GET "/requests/review/#{r._id}", {}, (rAbha) ->
                reply = expertComment: "good", expertAvailability: "ok", expertStatus: "available"
                expertId = rAbha.suggested[0].expert._id
                PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r2) ->
                  expect(r2.status).to.equal('review')
                  LOGIN {key:spcorKey}, {retainSession:false}, (sCustomer) ->
                    GET "/requests/#{r._id}/book/#{expertId}", {}, (review) ->
                      expect(review.status).to.equal('review')
                      expect(review.suggested.length).to.equal(1)
                      EXPECT.equalIds(review.suggested[0].expert._id,expertId)
                      expect(review.suggested[0].suggestedRate).to.exist
                      expect(review.suggested[0].suggestedRate.expert).to.equal(155)
                      expect(review.suggested[0].suggestedRate.total).to.equal(240)
                      DONE()

          testNotAvailable testAvailable



#   IT 'Cannot reply to customers own request'

#   IT 'Cannot reply to overloaded request with 4 existing available replies'



module.exports = ->

  before (done) ->
    DB.ensureDoc 'User', FIXTURE.users.admin, ->
    DB.ensureExpert 'snug', ->
      done()

  beforeEach ->
    STUB.SlackCommon()


  DESCRIBE "Create", create
  DESCRIBE "Review", review
