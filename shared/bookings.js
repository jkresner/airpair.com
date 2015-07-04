var util = require('./util')

var utilFns = {

  customers(booking) {
    return _.where(booking.participants, (p)=> p.role == 'customer')
  },

  experts(booking) {
    return _.where(booking.participants, (p)=> p.role == 'expert')
  },

  firstCustomer(booking) {
    return utilFns.customers(booking)[0].info
  },

  firstExpert(booking) {
    return utilFns.experts(booking)[0].info
  },

  searchBits(booking) {
    return [
      util.firstName(utilFns.firstCustomer(booking).name).replace("'",""),
      util.firstName(utilFns.firstExpert(booking).name).replace("'","")
    ]
  },

  participantFromUser(role, user) {
    var timeLoc = !user.localization || !user.localization.timezoneData ? {} :
      { location:user.localization.location, timeZoneId:user.localization.timezoneData.timeZoneId }

    return _.extend(timeLoc, { role, info: { _id: user._id, name: user.name, email: user.email } })
  },

  multitime(booking) {
    var momUtc = moment.utc(new Date(booking.datetime).toISOString())
    var multitime = momUtc.format('ddd DD hA z')
    var mainDate = momUtc.format('ddd DD ')
    var timezones = ['Universal']
    booking.participants.forEach(function(p) {
      if (p.timeZoneId && !_.contains(timezones,p.timeZoneId)) {
        timezones.push(p.timeZoneId)
        var localTime = momUtc.tz(p.timeZoneId).format('ddd DD hA z').replace(mainDate,'')
        multitime += ` | ${localTime}`
      }
    })
    return multitime
  },

  statusLetter(booking) {
    if (booking.status == 'pending') return 'p'
    if (booking.status == 'confirmed') return 'c'
    if (booking.status == 'followup') return 'f'
    if (booking.status == 'complete') return 'z'
    if (booking.status == 'canceled') return 'v'
  },

  // statusBotMessage(booking) {
  //   if (booking.status == 'confirmed')
  //     return 'c'
  //   if (booking.status == 'followup')
  //     return 'f'
  // },

  chatGroup(booking) {
    var customer = utilFns.customers(booking)[0]
    var customerFirst = util.firstName(customer.info.name).replace("'","")
    var expert = utilFns.experts(booking)[0]
    var expertFirst = util.firstName(expert.info.name).replace("'","")
    var statusLetter = utilFns.statusLetter(booking)
    var purpose = `https://airpair.com/bookings/${booking._id} ${customerFirst}`
    purpose += (customer.timeZoneId) ? ` (${moment.tz(customer.timeZoneId).format('z')}, ${customer.location})` : ``
    purpose += ` + ${expertFirst}`
    purpose += (expert.timeZoneId) ? ` (${moment.tz(expert.timeZoneId).format('z')}, ${expert.location})` : ``
    if (booking.status == "pending")
      purpose += `. WAITING to confirm ${booking.minutes} mins @ ${utilFns.multitime(booking)}.`
    else if (booking.status == "confirmed")
      purpose += `. CONFIRMED ${booking.minutes} mins @ ${utilFns.multitime(booking)}.`
    else if (booking.status == "followup")
      purpose += `. FEEDBACK required to payout expert for ${booking.minutes} mins on ${utilFns.multitime(booking)}.`

    // console.log('statusLetter', statusLetter, 'purpose', purpose)
    return {
      name: `${statusLetter}-${customerFirst}-${expertFirst}-${booking._id}`.toLowerCase().substring(0,21),
      purpose,
      topic: `Let's find a time to pair`
    }
  },

  hangoutName(booking) {
    var customerFirst = util.firstName(utilFns.firstCustomer(booking).name)
    var expertFirst = util.firstName(utilFns.firstExpert(booking).name)
    return `AirPair ${customerFirst} + ${expertFirst}`
  },

  hangoutParticipants(booking) {
    var hps = []
    booking.participants.forEach((p) =>
      hps.push({id:p.gmail||p.info.email,invite_type:'EMAIL'})
    )
    return hps
  }

}

module.exports = utilFns
