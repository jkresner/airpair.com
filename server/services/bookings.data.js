import * as md5         from '../util/md5'

module.exports = {

  select: {
    listAdmin: {
      'customerId': 1,
      'expertId': 1,
      'type': 1,
      'minutes': 1,
      'createdById':1,
      'status':1,
      'datetime':1,
      // 'gcal':1,
      'recordings':1,
      'participants':1,
      // 'orderId':1
    },
    setAvatars: (booking) => {
      if (booking && booking.participants)
        for (var p of booking.participants)
          p.info.avatar = md5.gravatarUrl(p.info.email)
    }
  },

  query: {
    inRange: function(start, end) {
     return {
        '$and': [
            {'datetime': { '$gt': new Date(parseInt(start)) }},
            {'datetime': { '$lt': new Date(parseInt(end)) }}
        ] }
    }
  },

  options: {
    orderByDate: { sort: { 'datetime': -1 } }
  }

}
