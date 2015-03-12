requestUtil = require('../../shared/requests')
db = require('./setup/db')
phlfKey = null
phlfExp = null

newCompleteRequestForAdmin = (userKey, requestData, cb) ->
  SETUP.newCompleteRequest userKey, requestData, (r) ->
    LOGIN 'admin', ->
      GET "/adm/requests/user/#{r.userId}", {}, (rAdm) ->
        expect(r.status).to.equal('received')
        expect(rAdm.length).to.equal(1)
        expect(rAdm[0].lastTouch.utc).to.exist
        expectStartsWith(rAdm[0].lastTouch.by.name,data.users[userKey].name)
        expect(rAdm[0].adm.active).to.be.true
        expect(rAdm[0].adm.owner).to.be.undefined
        expect(rAdm[0].adm.lastTouch).to.be.undefined
        expect(rAdm[0].adm.submitted).to.exist
        expect(rAdm[0].adm.received).to.be.undefined
        expect(rAdm[0].adm.farmed).to.be.undefined
        expect(rAdm[0].adm.reviewable).to.be.undefined
        expect(rAdm[0].adm.booked).to.be.undefined
        expect(rAdm[0].adm.paired).to.be.undefined
        expect(rAdm[0].adm.feedback).to.be.undefined
        expect(rAdm[0].adm.closed).to.be.undefined
        expect(rAdm[0].messages.length).to.equal(0)
        cb(r)



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
    newCompleteRequestForAdmin 'hubr', d, (r) ->
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
    newCompleteRequestForAdmin 'hbri', d, (r) ->
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


  it.skip 'Pipeliner can update expert matching stats', (done) ->
    d = type: 'other', tags: [data.tags.node]
    newCompleteRequestForAdmin 'hubi', d, (r) ->
      LOGIN phlfKey, (sAbha) ->
        reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
        PUT "/requests/#{r._id}/reply/#{data.experts.abha._id}", reply, {}, (r1) ->
          LOGIN 'admin', data.users.admin, ->
            PUT "/matchmaking/experts/#{data.experts.abha._id}/matchify", {}, {}, (eAbha) ->
              expect(eAbha.matching).to.exist
              done()


  it.skip 'Pipeliner can junk request', (done) ->
  it.skip 'Pipeliner setting to cancel closes request', (done) ->
  it.skip 'Pipeliner setting to complete closes request', (done) ->

