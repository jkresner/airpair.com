var Roles = require('../roles').booking

var validation = {

  createBooking(user, expert, datetime, minutes, type, credit, payMethodId, requestId)
  {
    if (!user.localization || !user.localization.timezone)
      return `Booking requires customer to have added their timezone`

    // if (!type) return `Booking type required`
    if (!minutes) return `Booking minutes required`
    if (!datetime) return `Booking datetime required`
  },

  // Full Feature: Step 5
  suggestTime(user, original, time)
  {
    if (original.status != 'pending')
      return `Booking [${original._id}] must be in pending state to suggest a new time`
    if (!time)
      return `Suggested booking time required`

    if (!Roles.isParticipant(user,original))
      return `Cannot suggest time. You[${user._id}] are not a participant to the Booking[${original._id}]`
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

  associateChat(user, booking, type, id)
  {
    if (booking.chatId) return `[${booking._id}] already associated with [${booking.chatId}]. Disassociate first?`
    if (type != "slack") return `Only slack chat supported at the moment`
  },

  addNote(user, booking, note)
  {
    if (!note || !note.length || note.length < 20) return `Note must be minimum 20 characters`
  }
}

module.exports = validation
