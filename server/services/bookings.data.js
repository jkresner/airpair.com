import * as md5         from '../util/md5'
var {selectFromObject}  = util
var {Slack}             = Wrappers
var {filterSlackHistory}= require("../../shared/bookings")

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
    'customerId': 1,
    'expertId': 1,
    'createdById':1,
    'chat': 1,
    'order':1,
    'orderId':1,     // leave this one for the create action
    'request': 1,
    'reviews':1
  },
  listAdmin: {
    '_id': 1,
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
    'order':1,
    'chatId':1,
    'chat':1,
    'paidout':1
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
    // $log('inflateParticipantInfo')
    for (var p of (participants || [])) {
      p.info.avatar = md5.gravatarUrl(p.info.email)
      p.chat = p.chat || { slack: Slack.checkUserSync(p.info) }
      if (p.chat.slack == null) delete p.chat
    }
  },
  inflateChatInfo(chat) {
    if (!chat) return
    chat.members = {}
    for (var m of chat.info.members||[])
      chat.members[m] = Slack.checkUserSync({id:m}) || {id:m}
    chat.history = filterSlackHistory(chat.history)
  },
  cb: {
    inflate(cb, selectFields) {
      var inflateSelect = (b) => {
        select.inflateParticipantInfo(b.participants)
        select.inflateChatInfo(b.chat)
        return (selectFields) ? selectFromObject(b,selectFields) : b
      }

      return (e,r) => {
        if (e) return cb(e)
        if (r.constructor === Array)
          r = _.map(r,(b)=>inflateSelect(b))
        else
          r = inflateSelect(r)
        cb(null,r)
      }
    },
    listAdmin(cb) {
      return (e,r) => {
        if (e) return cb(e)
        for (var b of r) {
          if (!b.order)
            $log('no order'.gray, b._id)
          else
            b.paidout = _.find(b.order.lineItems||[],(li)=>
              li.info!=null&&li.info.paidout!=null)

          if (b.paidout) b.paidout = b.paidout.info
          if (b.order) delete b.order.lineItems
        }
        select.cb.inflate(cb,select.listAdmin)(e,r)
      }
    },
    itemIndex(cb) {
      return (e,r) => {
        if (e) return cb(e)
        if (r.order) {
          for (var li of r.order.lineItems) {
            if (li.info.paidout != null) r.order.paidout = li.info.paidout
            if (li.info.released != null) r.order.released = li.info.released
          }

          delete r.order.lineItems
        }
        select.cb.inflate(cb,select.itemIndex)(e,r)
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
  getById: {
    join: {
      'chatId': '_id type provider, providerId',
    }
  },
  forAdmin: {
    join: {
      'orderId': '_id type lineItems.info.released lineItems.info.paidout lineItems.info.expert requestId',
    }
  },
  forParticipant: {
    join: {
      'orderId': '_id type lineItems.info.released lineItems.info.paidout requestId',
      // 'requestId': '_id title brief tags',
      // 'chatId': '_id info.name',
    }
  },
  adminList: {
    sort: { 'datetime': -1 },
    join: {
      'chatId': '_id info.name',
      'orderId': '_id type lineItems.info.released lineItems.info.paidout requestId',
    }
  }
}


module.exports = {select,query,opts}
