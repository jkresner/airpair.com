var validation = {
  createBooking(user, expert, time, minutes, type, credit, payMethodId, requestId) {



  },
  updateByAdmin(user, original, update) {
    // $log('validation.updateByAdmin', user, original, update)

    if (!update.type) return `Booking type required`
    if (!update.minutes) return `Booking minutes required`
    if (!update.createdById) return `Booking createdById required`
    if (!update.status) return `Booking status required`
    if (!update.datetime) return `Booking datetime required`
    if (!update.orderId) return `Booking orderId required`

    if (original.gcal && update.sendGCal) return `Updating gCAL events not yet supported`

  },
  confirmBooking(user, original, update)
  {

  },

  addYouTubeData(user, original, youTubeId)
  {
    if (!youTubeId) return `YouTube ID Required`
    var existing = _.find(original.recordings, (r) => r.data.youTubeId == youTubeId)
    if (existing)
      return `YouTube ID already exists`
  },

  addHangout(user, original, youTubeId, youTubeAccount, hangoutUrl){
    if (!youTubeAccount) return `YouTube Account Required`
    if (!hangoutUrl) return `Hangout URL Required`
    return validation.addYouTubeData(user, original, youTubeId)
  },


  cheatExpertSwap(user, original, order, request, suggestionId) {
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
  }


}

module.exports = validation
