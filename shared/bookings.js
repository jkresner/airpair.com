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
      util.firstName(utilFns.firstCustomer(booking).name),
      util.firstName(utilFns.firstExpert(booking).name)
    ]
  },

  chatGroup(booking) {
    var customerFirst = util.firstName(utilFns.firstCustomer(booking).name)
    var expertFirst = util.firstName(utilFns.firstExpert(booking).name)
    var statusLetter = booking.status.substring(0,1)
    return {
      name: `${statusLetter}-${customerFirst}-${expertFirst}-${booking._id}`.toLowerCase().substring(0,21),
      purpose: `https://www.airpair.com/bookings/${booking._id} ${customerFirst} (), ${expertFirst} ()`,
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
