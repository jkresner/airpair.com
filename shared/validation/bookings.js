var validation = {
  createBooking(user, expert, time, minutes, type, credit, payMethodId, requestId) {



  },
  updateByAdmin(user, original, update) {
    // $log('validation.updateByAdmin', user, original, update)

    if (!update.type) return 'Booking type required'
    if (!update.minutes) return 'Booking minutes required'
    if (!update.createdById) return 'Booking createdById required'
    if (!update.status) return 'Booking status required'
    if (!update.datetime) return 'Booking datetime required'
    if (!update.orderId) return 'Booking orderId required'

    if (original.gcal && update.sendGCal) return ("Updating gCAL events not yet supported")

  },
  confirmBooking(user, original, update)
  {

  },

  addYouTubeData(user, original, youTubeId)
  {
    if (!youTubeId) return "YouTube ID Required"
    var existing = _.find(original.recordings, (r) => r.data.youTubeId == youTubeId)
    if (existing)
      return "YouTube ID already exists"
  },

  addHangout(user, original, youTubeId, youTubeAccount, hangoutUrl){
    if (!youTubeAccount) return "YouTube Account Required"
    if (!hangoutUrl) return "Hangout URL Required"
    return validation.addYouTubeData(user, original, youTubeId)
  }
}

module.exports = validation
