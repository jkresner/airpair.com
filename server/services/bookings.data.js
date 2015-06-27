import * as md5         from '../util/md5'

var data = {

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
      'orderId':1,
      'chatId':1,
    },
    experts: {
      '_id': 1,
      'customerId': 1,
      'expertId': 1,
      'requestId': 1,
      'type': 1,
      'minutes': 1,
      'status':1,
      'datetime':1,
      'participants':1
    },
    setAvatars: (booking) => {
      if (booking && booking.participants)
        for (var p of booking.participants) {
          p.info.avatar = md5.gravatarUrl(p.info.email)
          if (!p.chat) {
            var slackUser = Wrappers.Slack.checkUserSync(p.info)
            if (slackUser)
              p.chat = { slack: { id: slackUser.id, name:slackUser.name } }
          }
        }
      if (booking.chat) {
        booking.chat.members = {}
        for (var m of booking.chat.info.members) {
          booking.chat.members[m] = Wrappers.Slack.checkUserSync({id:m}) || {id:m}
        }
      }
    },
    cb: {
      setAvatarsCB(cb) {
        return (e, booking) => {
          Wrappers.Slack.getUsers(()=>{
            if (e) return cb(e)
            data.select.setAvatars(booking)
            cb(null,booking)
          })
        }
      },
      inflateAvatars(cb) {
        return (e,r) => {
          Wrappers.Slack.getUsers(()=>{
            if (e) return cb(e)
            for (var o of r)
              data.select.setAvatars(o)
            cb(null, r)
          })
        }
      }
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


module.exports = data
