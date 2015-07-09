var {firstName,idsEqual} = require('./util')

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
      firstName(utilFns.firstCustomer(booking).name).replace("'",""),
      firstName(utilFns.firstExpert(booking).name).replace("'","")
    ]
  },

  rebookUrl(booking) {
    // TODO expand function to check date etc.
    if (booking.request)
      return `/billing/book/${booking.expertId}/${booking.request._id}`
    return `/billing/book/${booking.expertId}`
  },

  timeToBookAgain(booking, user) {
    var {status,customerId} = booking
    return idsEqual(customerId,user._id) &&
      status == 'complete' // || status == 'followup'
  },

  participantFromUser(role, user) {
    var timeLoc = !user.localization || !user.localization.timezoneData ? {} :
      { location:user.localization.location, timeZoneId:user.localization.timezoneData.timeZoneId }

    return _.extend(timeLoc, { role, info: { _id: user._id, name: user.name, email: user.email } })
  },

  suggestedTimesInflate(b,timeZoneId)
  {
    return _.map(b.suggestedTimes,(t)=>{
      return {
        _id:t._id,
        multitime:utilFns.multitime(b,t.time),
        localTime:moment(t.time).tz(timeZoneId||'Universal').format('h:mmA z'),
        by: _.find(b.participants,(p)=>idsEqual(t.byId,p.info._id)) }
    })
  },

  multitime(booking, time) {
    var momUtc = moment.utc(new Date(time||booking.datetime).toISOString())
    var multitime = momUtc.format('ddd DD HH:mm z')
    var mainDate = momUtc.format('ddd DD ')
    var timezones = ['Universal']
    booking.participants.forEach(function(p) {
      if (p.timeZoneId && !_.contains(timezones,p.timeZoneId)) {
        timezones.push(p.timeZoneId)
        var localTime = momUtc.tz(p.timeZoneId).format('ddd DD h:mmA z').replace(mainDate,'').replace(':00','')
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
    var customerFirst = firstName(customer.info.name).replace("'","")
    var expert = utilFns.experts(booking)[0]
    var expertFirst = firstName(expert.info.name).replace("'","")
    // var statusLetter = utilFns.statusLetter(booking)
    var purpose = `http://bookings.airpair.com/${booking._id} ${customerFirst}`
    purpose += (customer.timeZoneId) ? ` (${moment.tz(customer.timeZoneId).format('z')}, ${customer.location})` : ``
    purpose += ` + ${expertFirst}`
    purpose += (expert.timeZoneId) ? ` (${moment.tz(expert.timeZoneId).format('z')}, ${expert.location})` : ``
    if (booking.status == "pending")
      purpose += `. WAITING to confirm ${booking.minutes} mins @ ${utilFns.multitime(booking)}`
    else if (booking.status == "confirmed")
      purpose += `. CONFIRMED ${booking.minutes} mins @ ${utilFns.multitime(booking)}`
    else if (booking.status == "followup")
      purpose += `. FEEDBACK required to payout expert for ${booking.minutes} mins on ${utilFns.multitime(booking)}`

    // console.log('statusLetter', statusLetter, 'purpose', purpose)
    return {
      name: `${customerFirst}-${expertFirst}-${booking._id}`.toLowerCase().substring(0,21),
      purpose,
      topic: `Let's find a time to pair`
    }
  },

  filterSlackHistory(messages)
  {
    var cleaned = []
    _.each(messages, (m)=>{
      if (!m.subtype || (
        m.subtype!='group_join' &&
        m.subtype!='group_name' &&
        m.subtype!='group_purpose'
      ))
        cleaned.push(m)
    })
    //TODO string replace @ mentions
    return cleaned
  },

  hangoutName(booking) {
    var customerFirst = firstName(utilFns.firstCustomer(booking).name)
    var expertFirst = firstName(utilFns.firstExpert(booking).name)
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
