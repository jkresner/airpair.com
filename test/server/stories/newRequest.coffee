newUser = require('./newUser')


newCompleteRequest = (userKey, requestData, cb) ->
  budget = requestData.budget || 100
  newUser userKey, {login:true,location:true,paymethod:true}, (sCustomer, sKey) ->
    request =
      type: 'mentoring',
      tags: [FIXTURE.tags.angular],
      experience: 'beginner',
      brief: 'this is a test yo',
      hours: "1",
      time: 'rush'
    request = _.extend(request, requestData)
    POST '/requests', request, (r0) ->
      PUT "/requests/#{r0._id}", _.extend(r0,{budget,title:'test'}), (r) ->
        cb(r, sCustomer, sKey)



requestForAdmin = (sCust, userKey, r, cb) ->
  LOGIN {key:'admin'}, ->
    GET "/adm/requests/user/#{r.userId}", (rAdm) ->
      expect(r.status).to.equal('received')
      expect(rAdm.length).to.equal(1)
      expect(rAdm[0].lastTouch._id).to.exist
      expectStartsWith(rAdm[0].lastTouch.by.name,FIXTURE.users[userKey].name)
      # $log(rAdm[0])
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
      cb(rAdm[0], sCust)


# newBookedRequestWithExistingExpert = (custKey, requestData, expertSession, cb) ->
#   SETUP.newCompleteRequest customerUserKey, {}, (request, customerSession) ->
#     LOGIN expertSession.userKey, () ->
#       reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
#       PUT "/requests/#{request._id}/reply/#{expertSession.expertId}", reply, {}, (r1) ->
#         LOGIN customerSession.userKey, ->
#           GET "/requests/#{request._id}/book/#{expertSession.expertId}", {}, (r2) ->
#             airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: customerSession.primaryPayMethodId, request: { requestId: request._id, suggestion: r2.suggested[0] }
#             POST "/bookings/#{expertSession.expertId}", airpair1, {}, (booking) ->
#               cb(request, booking, customerSession, expertSession)


module.exports = (custKey, opts, done) ->
  newCompleteRequest custKey, opts.data||{}, (request, custSession, custKey) ->
    if opts.forAdmin
      requestForAdmin custSession, custKey, request, done
    else if !opts.reply
      done request, custSession
    else
      expertId = FIXTURE.experts[opts.reply.userKey]._id
      LOGIN {key:opts.reply.userKey}, (expertSession) ->
        reply = expertComment: "I'll take it", expertAvailability: "Real-time", expertStatus: "available"
        PUT "/requests/#{request._id}/reply/#{expertId}", reply, (r1) ->
          if !opts.book
            done r1, custSession, expertSession
          else
            LOGIN {key:custKey}, ->
              GET "/requests/#{request._id}/book/#{expertId}", (r2) ->
                airpair1 = datetime: moment().add(2, 'day'), minutes: 60, type: 'private', payMethodId: custSession.primaryPayMethodId, request: { requestId: request._id, suggestion: r2.suggested[0] }
                POST "/bookings/#{expertId}", airpair1, (booking) ->
                    done(r1, booking, custSession, expertSession)
