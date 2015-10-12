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
    if !opts.reply
      done request, custSession
    else
      {expertId} = opts.reply
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
