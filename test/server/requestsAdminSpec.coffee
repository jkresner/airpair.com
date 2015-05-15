requestUtil = require('../../shared/requests')
phlfKey = null
phlfExp = null

module.exports = -> describe "Admin".subspec, ->

  before (done) ->
    SETUP.createNewExpert 'phlf', {}, (s,exp) ->
      phlfKey = s.userKey
      phlfExp = exp
      done()


  it 'Pipeliner can reply to a new request', itDone ->
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
          DONE()


  it.only 'Pipeliner can farm a new request', itDone ->
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
            expectStartsWith(rFail.message,'Can only share request once')
            DONE()



  it 'Pipeliner can suggest and remove experts', itDone ->
    SETUP.addAndLoginLocalUserWithEmailVerified 'kaun', (s) ->
      spy = sinon.spy(mailman,'sendRawTextEmail')
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
                PUT "/matchmaking/experts/#{phlfExp._id}/matchify/#{r._id}", {}, {}, (exp1) ->
                  ds = msg: exp1.suggest
                  PUT "/matchmaking/requests/#{r._id}/add/#{phlfExp._id}", ds, {}, (reqWexp) ->
                    GET "/adm/requests/user/#{s._id}", {}, (reqs2) ->
                      expect(reqs2.length).to.equal(1)
                      expect(reqs2[0].suggested.length).to.equal(1)
                      PUT "/adm/requests/#{r._id}/remove/#{phlfExp._id}", {}, {}, (reqRexp) ->
                        expect(reqRexp.suggested.length).to.equal(0)
                        expect(spy.callCount).to.equal(1)
                        expectStartsWith(spy.args[0][1], "angularjs AirPair?")
                        expectStartsWith(spy.args[0][2], "Hi Phil,")
                        DONE()


  it 'Expert can reply when suggested by pipeliner', itDone ->
    {_id} = data.requests.suggestReply
    SETUP.ensureV1LoggedInExpert 'abpa', (abpa) ->
      db.ensureDoc 'Request', data.requests.suggestReply, () ->
        LOGIN 'admin', (adm) ->
          GET "/adm/requests/#{_id}", {}, (r) ->
            expectIdsEqual(r._id, _id)
            expect(r.suggested.length).to.equal(0)
            query = requestUtil.mojoQuery(r)
            GET "/experts/mojo/rank?#{query}", {}, (matches) ->
              eAbpa = _.find(matches,(m)=>m.name=="Abhishek Parolkar")
              expertId = eAbpa._id
              PUT "/matchmaking/experts/#{expertId}/matchify/#{r._id}", {}, {}, (exp1) ->
                expect(exp1.matching).to.exist
                ds = msg: exp1.suggest
                PUT "/matchmaking/requests/#{r._id}/add/#{expertId}", ds, {}, (r2) ->
                  expect(r2.suggested.length).to.equal(1)
                  expect(r2.suggested[0].expertStatus).to.equal 'waiting'
                  LOGIN 'abpa', ->
                    reply = expertComment: "I'll take it", expertAvailability: "No thanks", expertStatus: "unavailable"
                    PUT "/requests/#{r._id}/reply/#{exp1._id}", reply, {}, (r3) ->
                      expect(r3.suggested.length).to.equal(1)
                      expect(r3.suggested[0].expertStatus).to.equal 'unavailable'
                      DONE()


  it 'Pipeliner can suggest v0 expert', itDone ->
    d = type: 'other', tags: [data.tags.node]
    SETUP.ensureV0Expert 'azv0', ->
      SETUP.newCompleteRequestForAdmin 'hbib', d, (r) ->
        PUT "/adm/requests/#{r._id}/message", { type: 'received', subject: "s", body: "b" }, {}, (r1) ->
          expect(r1.status,'waiting')
          expect(r1.adm.owner,'ad')
          query = requestUtil.mojoQuery(r1)
          GET "/experts/mojo/rank?#{query}", {}, (matches) ->
            expect(matches.length).to.equal(1)
            expect(matches[0].matching).to.be.undefined
            expertId = matches[0]._id
            PUT "/matchmaking/experts/#{expertId}/matchify/#{r._id}", {}, {}, (exp1) ->
              expect(exp1.matching).to.exist
              PUT "/matchmaking/requests/#{r._id}/add/#{expertId}", {msg:{subject:'Test',body:'Test'}}, {}, (r2) ->
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
                      DONE()


  it 'Pipeliner can update expert matching stats', itDone ->
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
              DONE()


  it 'Pipeliner can junk request', itDone ->
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
        DONE()


  it 'Pipeliner setting to canceled closes request', itDone ->
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
        DONE()


  it.skip 'Pipeliner setting to complete closes request', itDone ->
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
        DONE()


  it "Pipeliner cannot set booked without a booking", itDone ->
    d = type: 'resources', tags: [data.tags.mongo]
    SETUP.newCompleteRequestForAdmin 'rpor', d, (r,sCust) ->
      msg = type: 'received', subject: "test subject", body: "test body"
      PUT "/adm/requests/#{r._id}/message", msg, {}, (r1) ->
        adm1 = r1.adm
        expect(r1.status).to.equal('waiting')
        expect(r1.adm.received).to.exist
        expect(r1.adm.reviewable).to.be.undefined
        LOGIN phlfKey, (sphilf) ->
          reply = expertComment: "I will take it", expertAvailability: "Realest time", expertStatus: "available"
          PUT "/requests/#{r1._id}/reply/#{phlfExp._id}", reply, {}, (r2) ->
            LOGIN 'admin', ->
              GET "/adm/requests/#{r1._id}", {}, (r3) ->
                expect(r3.adm.received).to.exist
                expect(r3.adm.reviewable).to.exist
                expect(r3.adm.booked).to.be.undefined
                r3.status = "booked"
                PUT "/adm/requests/#{r1._id}", r3, { status: 403}, (err) ->
                  expectStartsWith(err.message, "Cannot set booked status manually")
                  DONE()



  it.skip "Can not undo request adm.booked", itDone ->
    ## Other ideas to test. Close a requesst and try book it closed and after reopned (put into review)
    ## Many problem requests had multiple orders
    # d = type: 'resources', tags: [data.tags.mongo]
    # SETUP.newCompleteRequestForAdmin 'jkjk', d, (r,sCust) ->
    #   msg = type: 'received', subject: "test subject", body: "test body"
    #   PUT "/adm/requests/#{r._id}/message", msg, {}, (r1) ->
    #     adm1 = r1.adm
    #     expect(r1.status).to.equal('waiting')
    #     expect(r1.adm.received).to.exist
    #     expect(r1.adm.reviewable).to.be.undefined
    #     LOGIN 'snug', (ssnug) ->
    #       reply = expertComment: "I will take it", expertAvailability: "Realest time", expertStatus: "available"
    #       PUT "/requests/#{r1._id}/reply/#{data.experts.snug._id}", reply, {}, (r2) ->
    #         LOGIN 'admin', ->
    #           GET "/adm/requests/#{r1._id}", {}, (r3) ->
    #             expect(r3.adm.received).to.exist
    #             expect(r3.adm.reviewable).to.exist
    #             expect(r3.adm.booked).to.be.undefined
    #             LOGIN sCust.userKey, (s) ->
    #               suggestion = r3.suggested[0]
    #               airpair1 = time: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: sCust.primaryPayMethodId, request: { requestId: r1._id, suggestion }
    #               POST "/bookings/#{suggestion.expert._id}", airpair1, {}, (booking1) ->
    #                 LOGIN 'admin', ->
    #                   GET "/adm/requests/#{r1._id}", {}, (r4) ->
    #                     expect(r4.adm.received).to.exist
    #                     expect(r4.adm.reviewable).to.exist
    #                     expect(r4.adm.booked).to.exist
    #                     r4.status = "review"
    #                     PUT "/adm/requests/#{r1._id}", r4, {}, (r5) ->
    #                       expect(r5.status).to.equal('review')
    #                       expect(r5.adm.received).to.exist
    #                       expect(r5.adm.reviewable).to.exist
    #                       expect(r5.adm.booked).to.exist
    #                       PUT "/matchmaking/requests/#{r._id}/add/#{data.experts.tmot._id}", {}, {}, (r6) ->
    #                         expect(r6.status).to.equal('review')
    #                         expect(r6.suggested.length).to.equal 2
    #                         expect(r6.adm.received).to.exist
    #                         expect(r6.adm.reviewable).to.exist
    #                         expect(r6.adm.booked).to.exist
    #                       # LOGIN 'snug', (ssnug) ->

    #                         DONE()



