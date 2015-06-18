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

  statusLetter(booking) {
    if (booking.status == 'pending') return 'p'
    if (booking.status == 'confirmed') return 'c'
    if (booking.status == 'followup') return 'f'
    if (booking.status == 'complete') return 'z'
    if (booking.status == 'canceled') return 'v'
  },

  chatGroup(booking) {
    var customer = utilFns.customers(booking)[0]
    var customerFirst = util.firstName(customer.info.name).replace("'","")
    var expert = utilFns.experts(booking)[0]
    var expertFirst = util.firstName(expert.info.name).replace("'","")
    var statusLetter = utilFns.statusLetter(booking)
    var purpose = `https://airpair.com/bookings/${booking._id} ${customerFirst}`
    purpose += (customer.timezone) ? ` (${customer.timezone}, ${customer.location})` : ``
    purpose += ` + ${expertFirst}`
    purpose += (expert.timezone) ? ` (${expert.timezone}, ${expert.location})` : ``
    console.log('statusLetter', statusLetter, 'purpose', purpose)

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
