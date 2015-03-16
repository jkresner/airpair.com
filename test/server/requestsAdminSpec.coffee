requestUtil = require('../../shared/requests')
db = require('./setup/db')
phlfKey = null
phlfExp = null

module.exports = -> describe "Admin".subspec, ->

  before (done) ->
    SETUP.analytics.stub()
    SETUP.initTags ->
      SETUP.createNewExpert 'phlf', {}, (s,exp) ->
        phlfKey = s.userKey
        phlfExp = exp
        done()

  after ->
    SETUP.analytics.restore()


  it 'Pipeliner can reply to a new request', (done) ->
    d = type: 'other', tags: [data.tags.node]
    SETUP.newCompleteRequestForAdmin 'hubr', d, (r) ->
      msg = type: 'received', subject: "test subject", body: "test body"
      PUT "/adm/requests/#{r._id}/message", msg, {}, (r1) ->
        adm1 = r1.adm
        expect(r1.status).to.equal('waiting')
        expect(adm1.active).to.be.true
        expect(adm1.owner).to.equal('ad')
        expect(adm1.lastTouch).to.exist
        expect(adm1.lastTouch.action).to.equal('sent:received')
        expect(adm1.submitted).to.exist
        expect(adm1.received).to.exist
        expect(adm1.farmed).to.be.undefined
        expect(adm1.reviewable).to.be.undefined
        expect(adm1.booked).to.be.undefined
        expect(adm1.paired).to.be.undefined
        expect(adm1.feedback).to.be.undefined
        expect(adm1.closed).to.be.undefined
        expect(r1.messages.length).to.equal(1)
        expect(r1.messages[0]._id).to.exist
        expect(r1.messages[0].type).to.equal('received')
        expect(r1.messages[0].subject).to.equal("test subject")
        expect(r1.messages[0].body).to.equal("test body")
        PUT "/adm/requests/#{r._id}/message", msg, {status:403}, (rFail) ->
          expectStartsWith(rFail.message,'Can not send the same message type once')
          done()


  it 'Pipeliner can farm a new request', (done) ->
    d = type: 'other', tags: [data.tags.node]
    SETUP.newCompleteRequestForAdmin 'hbri', d, (r) ->
      PUT "/adm/requests/#{r._id}/message", { type: 'received', subject: "s", body: "b" }, {}, (r1) ->
        tweet = requestUtil.buildDefaultFarmTweet(r)
        PUT "/adm/requests/#{r._id}/farm", { tweet }, {}, (r1) ->
          adm1 = r1.adm
          expect(r1.status).to.equal('waiting')
          expect(adm1.active).to.be.true
          expect(adm1.owner).to.equal('ad')
          expect(adm1.lastTouch).to.exist
          expect(adm1.lastTouch.action).to.equal('farm')
          expect(adm1.submitted).to.exist
          expect(adm1.received).to.exist
          expect(adm1.farmed).to.exist
          expect(adm1.reviewable).to.be.undefined
          expect(adm1.booked).to.be.undefined
          expect(adm1.paired).to.be.undefined
          expect(adm1.feedback).to.be.undefined
          expect(adm1.closed).to.be.undefined
          expect(r1.messages.length).to.equal(1)
          PUT "/adm/requests/#{r._id}/farm", { tweet }, {status:403}, (rFail) ->
            expectStartsWith(rFail.message,'Can not share request once')
            done()



  it 'Pipeliner can suggest and remove experts', (done) ->
    SETUP.addAndLoginLocalUserWithEmailVerified 'kaun', (s) ->
      spy = sinon.spy(mailman,'sendExpertSuggestedEmail')
      d = tags: [data.tags.angular], type: 'resources', experience: 'proficient', brief: 'bah bah anglaur test yo4', hours: "1", time: 'rush'
      POST '/requests', d, {}, (r0) ->
        PUT "/requests/#{r0._id}", _.extend(r0,{budget:300}), {}, (r) ->
          LOGIN 'admin', (sAdmin) ->
            GET "/adm/requests/user/#{s._id}", {}, (reqs1) ->
              expect(reqs1.length).to.equal(1)
              expect(reqs1[0].suggested.length).to.equal(0)
              reqs1[0].status = 'waiting'
              reqs1[0].adm.owner = 'ad'
              PUT "/adm/requests/#{r._id}", reqs1[0], {}, (reqWexp) ->
                PUT "/matchmaking/requests/#{r._id}/add/#{phlfExp._id}", {}, {}, (reqWexp) ->
                  GET "/adm/requests/user/#{s._id}", {}, (reqs2) ->
                    expect(reqs2.length).to.equal(1)
                    expect(reqs2[0].suggested.length).to.equal(1)
                    PUT "/adm/requests/#{r._id}/remove/#{phlfExp._id}", {}, {}, (reqRexp) ->
                      expect(reqRexp.suggested.length).to.equal(0)
                      expect(spy.callCount).to.equal(1)
                      expectStartsWith(spy.args[0][0].name, phlfExp.name)
                      expectStartsWith(spy.args[0][0].email,phlfExp.email)
                      expectStartsWith(spy.args[0][1],"Kyle Aungst")
                      expectIdsEqual(spy.args[0][2],r._id)
                      expectStartsWith(spy.args[0][3],"Admin Daemon")
                      expect(spy.args[0][4].length).to.equal(1)
                      expect(spy.args[0][4][0].slug).to.equal('angularjs')
                      done()


  it 'Pipeliner can suggest v0 expert', (done) ->
    d = type: 'other', tags: [data.tags.node]
    SETUP.ensureV0Expert 'azv0', ->
      SETUP.newCompleteRequestForAdmin 'hbib', d, (r) ->
        PUT "/adm/requests/#{r._id}/message", { type: 'received', subject: "s", body: "b" }, {}, (r1) ->
          expect(r1.status,'waiting')
          expect(r1.adm.owner,'ad')
          GET "/experts/match/#{r._id}", {}, (matches) ->
            expect(matches.length).to.equal(1)
            expect(matches[0].matching).to.be.undefined
            expertId = matches[0]._id
            PUT "/matchmaking/experts/#{expertId}/matchify/#{r._id}", {}, {}, (exp1) ->
              expect(exp1.matching).to.exist
              PUT "/matchmaking/requests/#{r._id}/add/#{expertId}", {}, {}, (r2) ->
                expect(r2.suggested.length).to.equal(1)
                sug = r2.suggested[0]
                expect(sug.matchedBy._id).to.exist
                expectIdsEqual(sug.matchedBy.userId,data.users.admin._id)
                expect(sug.matchedBy.initials).to.equal('ad')
                expect(sug.matchedBy.type).to.equal('staff')
                expectIdsEqual(sug.expert._id,data.experts.azv0._id)
                expect(sug.expert.avatar).to.exist
                LOGIN 'azv0', (sAzv0) ->
                  GET "/requests/review/#{r._id}", {}, (rAzv0) ->
                    expect(rAzv0.status).to.equal('waiting')
                    seAzv0 = rAzv0.suggested[0].expert
                    expectIdsEqual(seAzv0._id, data.experts.azv0._id)
                    expect(seAzv0.isV0).to.be.true
                    reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
                    PUT "/requests/#{r._id}/reply/#{seAzv0._id}", reply, { status: 403 }, (err) ->
                      expectStartsWith(err.message, "Must migrate expert profile to reply")
                      done()


  it 'Pipeliner can update expert matching stats', (done) ->
    d = type: 'other', tags: [data.tags.node]
    SETUP.newCompleteRequestForAdmin 'hubi', d, (r) ->
      LOGIN phlfKey, (sAbha) ->
        reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
        PUT "/requests/#{r._id}/reply/#{phlfExp._id}", reply, {}, (r1) ->
          expect(r1.suggested[0].expert.avatar).to.exist
          LOGIN 'admin', ->
            PUT "/matchmaking/experts/#{phlfExp._id}/matchify/#{r._id}", {}, {}, (exp2) ->
              expect(exp2.avatar).to.exist
              expect(exp2.matching).to.exist
              expect(exp2.matching.experience).to.exist
              expect(exp2.matching.replies).to.exist
              done()


  it 'Pipeliner can junk request', (done) ->
    adm = data.users.admin
    d = type: 'mentoring', tags: [data.tags.mongo]
    SETUP.newCompleteRequestForAdmin 'tylb', d, (r,sCust) ->
      expect(r.adm.close).to.be.undefined
      expect(r.lastTouch.action).to.equal('updateByCustomer')
      expectIdsEqual(r.lastTouch.by._id,sCust._id)
      # bit whacky to get the client to do this, but ehhhhh
      r.adm.owner = adm.email.replace("@airpair.com","")
      r.status = 'junk'
      PUT "/adm/requests/#{r._id}", r, {}, (r2) ->
        expect(r2.status).to.equal('junk')
        expect(r2.adm.closed).to.exist
        expect(r2.adm.lastTouch.action).to.equal('closed:junk')
        expectIdsEqual(r2.adm.lastTouch.by._id,adm._id)
        expect(r2.lastTouch.action).to.equal('updateByCustomer')
        expectIdsEqual(r2.lastTouch.by._id,sCust._id)
        done()


  it 'Pipeliner setting to canceled closes request', (done) ->
    adm = data.users.admin
    d = type: 'resources', tags: [data.tags.mongo]
    SETUP.newCompleteRequestForAdmin 'tbau', d, (r,sCust) ->
      # bit whacky to get the client to do this, but ehhhhh
      r.adm.owner = adm.email.replace("@airpair.com","")
      r.status = 'canceled'
      PUT "/adm/requests/#{r._id}", r, {}, (r2) ->
        expect(r2.status).to.equal('canceled')
        expect(r2.adm.closed).to.exist
        expect(r2.adm.lastTouch.action).to.equal('closed:canceled')
        expectIdsEqual(r2.adm.lastTouch.by._id,adm._id)
        done()


  it.skip 'Pipeliner setting to complete closes request', (done) ->
    adm = data.users.admin
    d = type: 'resources', tags: [data.tags.mongo]
    SETUP.newCompleteRequestForAdmin 'tbar', d, (r,sCust) ->
      # bit whacky to get the client to do this, but ehhhhh
      r.adm.owner = adm.email.replace("@airpair.com","")
      r.status = 'complete'
      PUT "/adm/requests/#{r._id}", r, { status: 403 }, (e1) ->
        expectStartsWith(e1.message,"Cannot complete a request with no booked experts")

        # TODO finish full story and test complete update at the end

        # expect(r2.status).to.equal('complete')
        # expect(r2.adm.closed).to.exist
        # expect(r2.adm.lastTouch.action).to.equal('closed:complete')
        # expectIdsEqual(r2.adm.lastTouch.by._id,adm._id)
        done()
