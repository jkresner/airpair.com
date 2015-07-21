var Roles = require('../roles').booking

var validation = {

  getById(user, original)
  {
    if (!Roles.isParticipantOrAdmin(user, original))
      return `You[${user._id}] are not a participants to this booking[${original._id}]`
  },

  getByIdForParticipant(user, original)
  {
    // $log('validation.getByIdForParticipant'.yellow, original)
    if (!Roles.isParticipantOrAdmin(user, original))
      return `You[${user._id}] are not a participants to this booking[${original._id}]`
  },

  createBooking(user, expert, datetime, minutes, type, credit, payMethodId, requestId)
  {
    if (!user.localization || !user.localization.timezone)
      return `Booking requires customer to have added their timezone`

    // if (!type) return `Booking type required`
    if (!minutes) return `Booking minutes required`
    if (!datetime) return `Booking datetime required`
  },

  suggestTime(user, original, time)
  {
    if (original.status != 'pending')
      return `Booking [${original._id}] must be in pending state to suggest a new time`
    if (!time)
      return `Suggested booking time required`

    if (!Roles.isParticipant(user,original))
      return `Cannot suggest time. You[${user._id}] are not a participant to the Booking[${original._id}]`

    var mom = moment(time)
    var existing = _.find(original.suggestedTimes,(t)=>mom.isSame(moment(t.time)))
    if (existing)
      return `Time[${mom}] already suggested as an option for Booking[${original._id}]`
  },

  removeSuggestedTime(user, original, timeId)
  {
    if (original.status != 'pending')
      return `Booking [${original._id}] must be in pending state to remove suggested time`

    if (!Roles.isParticipant(user,original))
      return `Cannot remove time. You[${user._id}] are not a participant to Booking[${original._id}]`

    var time = _.find(original.suggestedTimes,(t)=>_.idsEqual(t._id,timeId))
    if (!time) return `Cannot remove time [${timeId}]. It does not belong to Booking[${original._id}]`
    if (!_.idsEqual(user._id,time.byId)) return `Can only remove your own time suggestion.`
  },

  confirmTime(user, original, timeId)
  {
    if (original.status != 'pending')
      return `Booking [${original._id}] must be in pending state to confirm time`

    if (!Roles.isParticipant(user,original))
      return `Cannot confirm time. You[${user._id}] are not a participant to Booking[${original._id}]`

    var time = _.find(original.suggestedTimes,(t)=>_.idsEqual(t._id,timeId))
    if (!time) return `Cannot confirm time [${timeId}]. It does not belong to Booking[${original._id}]`
    if (_.idsEqual(user._id,time.byId)) return `Cannot confirm your own time suggestion.`
    if (time.confirmedById) return `Time already confirmed`
  },

  customerFeedback(user, original, review, expert, expertReview)
  {
    var {status} = original
    if (status != 'followup' && status != 'complete')
      return `Booking [${original._id}] must be in folloup or complete state to leave customerFeedback`

    if (!Roles.isCustomer(user,original))
      return `Not a customer on booking[${original._id}]`

    if (!review)
      return `Booking customer feedback review required"`

    //--
    var existingReview = _.find(original.reviews||[],(r)=>_.idsEqual(r.by._id,user._id))
    if (existingReview && !bookingReview._id)
      return `Expecting update for existing bookingReview[${existingReview._id}] on booking[${original._id}]`

    if (expertReview) {
      // return "Booking customer feedback review required"
      //-- Check similar for expert review? Or join on original.populate?
      var existingExpertReview = _.find(expert.reviews||[],(r)=>_.idsEqual(r.by._id,user._id))
      if (existingExpertReview && !expertReview._id)
        return `Expecting update for existing expertReview[${existingExpertReview._id}] on expert[${expert._id}]`
    }
  },

  updateByAdmin(user, original, update)
  {
    // $log('validation.updateByAdmin'.cyan, user, original, update)

    if (!update.type) return `Booking type required`
    if (!update.minutes) return `Booking minutes required`
    if (!update.createdById) return `Booking createdById required`
    if (!update.status) return `Booking status required`
    if (!update.datetime) return `Booking datetime required`

    // TODO: this was disabled as a hack for the updateByAdmin call 2015-07-01 (jk+gn)
    // if (!update.orderId) return `Booking orderId required`
    if (update.order) return `Booking update should not include order join object`
    if (update.request) return `Booking update should not include request join object`

    if (original.gcal && update.sendGCal) return `Updating gCAL events not yet supported`

    if (update.status != original.status) {
      // if (update.status == 'confirmed')
        // return `Cannot set Booking confirmed status manually. Participant must confirm time`
      if (update.status == 'complete')
        return `Cannot set Booking complete status manually. Release expert payment, save the recording & get customer feedback`
    }
  },

  postChatMessage(user, original, chatMessage)
  {
    var type = (chatMessage) ? chatMessage.type : null
    if (!type || !(type=='attachmet'||type=='message'))
      return `Booking chat type [message] or [attachment] required`
    if (!chatMessage.text)
      return `Booking chat message text required`
    if (!chatMessage.key)
      return `Booking chat message key require`
    if (!cache.templates[`slack-message:booking-${original.status}-${chatMessage.key}`])
      return `Booking chat message template [booking-${original.status}-${chatMessage.key}] not found`
    if (!original.chat)
      return `Booking[${original._id}] requires associate chat to post message to`
  },

  addYouTubeData(user, original, youTubeId)
  {
    if (!youTubeId) return `YouTube ID Required`
    var existing = _.find(original.recordings, (r) => r.data.youTubeId == youTubeId)
    if (existing)
      return `YouTube ID already exists`
  },

  addHangout(user, original, youTubeId, youTubeAccount, hangoutUrl)
  {
    if (!youTubeAccount) return `YouTube Account Required`
    if (!hangoutUrl) return `Hangout URL Required`
    return validation.addYouTubeData(user, original, youTubeId)
  },

  deleteRecording(user, original, recordingId)
  {
    if (!recordingId) return `RecordingId Required`
    var existing = _.find(original.recordings, (r) => r._id == recordingId)
    if (!existing)
      return `Recording with ${recordingId} does not belong to booking[${booking._id}]`
  },

  cheatExpertSwap(user, original, order, request, suggestionId)
  {
    if (!request) return `Cannot swap expert from non request booking`
    if (!order) return `Cannot find order to swap expert from`

    var suggestion = _.find(request.suggested, (s)=> _.idsEqual(suggestionId,s._id))

    if (!suggestion) return `Cannot find suggestion[${suggestionId}] to swap`
    if (suggestion.expertStatus != `available`) return `Can only swap available expert`

    if (_.idsEqual(original.expertId,suggestion.expert._id)) `Cannot swap expert with themselves`
    if (!_.idsEqual(order._id,original.orderId)) `Cannot alter order[${order._id}] not belonging to booking[${booking._id}]`

    var bookingLine = _.find(order.lineItems,(li)=>li.type=='airpair'&&_.idsEqual(li.info.expert._id,original.expertId))
    if (!bookingLine) return `Cannot bookingLine with expert[${booking.expert}] from booking[${booking._id}]`
    if (bookingLine.paidout) return `Cannot swap expert for already paid our bookingLine[${bookingLine._id}]`
  },

  createChat(user, booking, type, groupchat)
  {
    if (booking.chatId) return `Cannot create chat. [${booking._id}] already associated with [${booking.chatId}]. Disassociate first?`
    if (type != "slack") return `Only slack group chat creation supported at the moment`
    if (!groupchat.name) return `Booking group chat name required`
    if (!groupchat.purpose) return `Booking group chat purpose required`
  },

  associateChat(user, booking, provider, providerId)
  {
    if (!Roles.isPrimaryExpertOrAdmin(user,booking))
      return `Must be primary expert on [${booking._id}] to associate existing chat`

    if (booking.chatId)
      return `[${booking._id}] already associated with [${booking.chatId}]. Disassociate first?`

    if (provider != "slack")
      return `Only slack chat supported at the moment`

    if (!providerId)
      return `ProviderId require to associate chat with Booking`
  },

  addNote(user, booking, note)
  {
    if (!note || !note.length || note.length < 20) return `Note must be minimum 20 characters`
  }
}

module.exports = validation
