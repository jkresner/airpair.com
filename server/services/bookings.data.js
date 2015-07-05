import * as md5         from '../util/md5'
var {selectFromObject}  = util
var {Slack}             = Wrappers

var select = {
  itemIndex: {
    '_id': 1,
    'participants': 1,
    'type': 1,
    'minutes': 1,
    'status': 1,
    'datetime': 1,
    'suggestedTimes': 1,
    'gcal': 1,
    'recordings': 1,
    'chatId': 1,
    'chat': 1,
    'customerId': 1,
    'expertId': 1,
    'createdById':1,
    'orderId':1,
    'reviews':1
  },
  listAdmin: {
    'customerId': 1,
    'expertId': 1,
    'type': 1,
    'minutes': 1,
    'createdById':1,
    'status':1,
    'datetime':1,
    'recordings':1,
    'participants.role':1,
    'participants.info':1,
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
  inflateParticipantInfo(participants) {
    for (var p of (participants || [])) {
      p.info.avatar = md5.gravatarUrl(p.info.email)
      p.chat = p.chat || Slack.checkUserSync(p.info)
      if (p.chat == null) delete p.chat
    }
  },
  inflateChatInfo(chat) {
    if (!chat) return
    chat.members = {}
    for (var m of chat.info.members)
      chat.members[m] = Slack.checkUserSync({id:m}) || {id:m}
  },
  cb: {
    inflate(cb, selectFields) {
      var inflateBooking = (b) => {
        select.inflateParticipantInfo(b.participants)
        select.inflateChatInfo(b.chat)
      }

      return (e,r) => {
        if (e) return cb(e)
        if (r.constructor === Array) r = _.map(r,(b)=>inflateBooking(b))
        else inflateBooking(r)
        if (selectFields) r = selectFromObject(r,selectFields)
        cb(null,r)
      }
    }
  }
}

var query = {
  inRange: function(start, end) {
   return {
      '$and': [
          {'datetime': { '$gt': new Date(parseInt(start)) }},
          {'datetime': { '$lt': new Date(parseInt(end)) }}
      ] }
  }
}

var opts = {
  orderByDate: { sort: { 'datetime': -1 } },
  forParticipant: {
    join: {
      'orderId': '_id type lineItems.info.released lineItems.info.paidout',
      'requestId': '_id title brief tags',
    }
  }
}


module.exports = {select,query,opts}
