module.exports = -> describe "API", ->

  before (done) ->
    stubAnalytics()
    testDb.initTags ->
      testDb.ensureExpert data.users.abha, data.experts.abha, done


  after (done) ->
    resotreAnalytics()
    done()


  beforeEach -> global.cookie = null


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


  it 'Can post an unfished request as logged in user', (done) ->
    addAndLoginLocalUser 'josh', (s) ->
      tag = _.extend({sort:1}, data.tags.node)
      d = type: 'mentoring'
      POST '/requests', d, {}, (r) ->
        expect(r._id).to.exist
        expect(_.idsEqual(s._id,r.userId)).to.be.true
        expect(r.type).to.equal('mentoring')
        expect(r.tags.length).to.equal(0)
        expect(r.budget).to.be.undefined
        expect(r.status).to.equal('received')
        done()


  it 'Can submit a full request', (done) ->
    addAndLoginLocalUser 'johb', (s) ->
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
                    done()


  it 'Can review a request as anon, customer and other', (done) ->
    addAndLoginLocalUser 'mfly', (s) ->
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
    addAndLoginLocalUser 'mfln', (s) ->
      d = tags: [data.tags.angular], type: 'code-review', experience: 'advanced', brief: 'another anglaur test yo3', hours: "5", time: 'regular', budget: 150
      POST '/requests', d, {}, (r) ->
        expect(r.status).to.equal('received')
        expect(r.suggested.length).to.equal(0)
        LOGIN 'abha', data.users.abha, (sAbha) ->
          GET "/requests/review/#{r._id}", {}, (rAbha) ->
            expect(rAbha.status).to.equal('received')
            expect(rAbha.tags.length).to.equal(1)
            expect(rAbha.brief).to.exist
            expect(rAbha.suggested.length).to.equal(1)
            expect(rAbha.suggested[0].expert.minRate).to.equal(70)
            expect(rAbha.suggested[0].expert.email).to.equal("abeisgreat@abeisgreat.com")
            expect(rAbha.suggested[0].suggestedRate.opensource.expert).to.equal(110)
            reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
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
              done()


  it 'Can update reply to a request as an expert', (done) ->
    addAndLoginLocalUser 'mikf', (s) ->
      d = tags: [data.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush', budget: 300
      POST '/requests', d, {}, (r) ->
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
                done()


  it 'Can book expert rate on request', (done) ->
    addAndLoginLocalUserWithPayMethod 'pcor', (spcor) ->
      d = tags: [data.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush', budget: 300
      POST '/requests', d, {}, (r) ->

        testNotAvailable = (callback) ->
          LOGIN 'abha', data.users.abha, (sAbha) ->
            GET "/requests/review/#{r._id}", {}, (rAbha) ->
              reply = expertComment: "I'm busy", expertAvailability: "Nah need a holiday", expertStatus: "busy"
              expertId = rAbha.suggested[0].expert._id
              PUT "/requests/#{r._id}/reply/#{expertId}", reply, {}, (r1) ->
                expect(r1.status).to.equal('received')
                LOGIN 'pcor', spcor, (sCustomer) ->
                  GET "/requests/book/#{r._id}/#{expertId}", { status: 400 }, (freview) ->
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
                  GET "/requests/book/#{r._id}/#{expertId}", {}, (review) ->
                    expect(review.status).to.equal('review')
                    expect(review.suggested.length).to.equal(1)
                    expect(_.idsEqual(review.suggested[0]._id,review.suggested[0]._id)).to.be.true
                    expect(review.suggested[0].suggestedRate).to.exist
                    expect(review.suggested[0].suggestedRate.opensource.expert).to.equal(155)
                    expect(review.suggested[0].suggestedRate.opensource.total).to.equal(220)
                    expect(review.suggested[0].suggestedRate.private.expert).to.equal(155)
                    expect(review.suggested[0].suggestedRate.private.total).to.equal(240)
                    done()

        testNotAvailable testAvailable


