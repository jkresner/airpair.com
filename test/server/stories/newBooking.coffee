newUser = require('./newUser')


module.exports = (userKey, opts, cb) ->
  bookingData = opts.data||{}
  newUser userKey, {login:true,location:true,paymethod:true}, (sessionCustomer, userKey) ->
    Object.assign(sessionCustomer,{userKey})

    if bookingData.expertKey
      bookingData.expertId = FIXTURE.experts[bookingData.expertKey]._id

    bData = _.extend({
        datetime:       moment().add(2, 'day')
        minutes:        120
        type:           'private'
        payMethodId:    sessionCustomer.primaryPayMethodId,
        expertId:       FIXTURE.experts.dros._id
        expertUserKey:  'dros'
      }, bookingData)

    POST "/bookings/#{bData.expertId}", bData, (booking) ->
      if (!bookingData.slackChatId)
        cb sessionCustomer, booking
      else
        LOGIN {key:"admin"}, ->
          c = type:'slack',providerId:bookingData.slackChatId
          PUT "/bookings/#{booking._id}/associate-chat", c, (b1) ->
            LOGIN {key:userKey}, ->
              cb sessionCustomer, b1


  # newBookingInConfirmedState: (customerUserKey, bookingData, cb) ->
  #   bookingData.expertUserKey = 'gnic'
  #   bookingData.slackChatId = bookingData.slackChatId || "G06UFP6AX"
  #   stories.newBookedExpert customerUserKey, bookingData, (s, b1) ->
  #     LOGIN bookingData.expertUserKey, (sExp) ->
  #       timeId = b1.suggestedTimes[0]._id
  #       PUT "/bookings/#{b1._id}/confirm-time", {_id:b1._id, timeId}, {}, (b2) ->
  #         expect(b2.status).to.equal("confirmed")
  #         LOGIN s.userKey, ->
  #           cb b2, s, sExp


  # newBookingInFollowupState: (customerUserKey, bookingData, cb) ->
  #   stories.newBookingInConfirmedState customerUserKey, bookingData, (b, sCust, sExp) ->
  #     LOGIN 'admin',(sadm) ->
  #       youTubeId = bookingData.youTubeId || "MEv4SuSJgwk"
  #       PUT "/adm/bookings/#{b._id}/recording", {youTubeId}, {}, (b2) ->
  #         expect(b2.status).to.equal("followup")
  #         LOGIN sCust.userKey, ->
  #           cb _.extend(b,{status:"followup"}), sCust, sExp
