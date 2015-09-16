var md5                   = require('../util/md5')
var {selectFromObject}              = util
var {Slack}                         = Wrappers
var {filterSlackHistory,participantSlackHandle,
  rebookUrl,multitime,
  customers,experts}                = require("../../shared/bookings")
var {pairbot,jk,support}            = config.chat.slack

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
    'order':1,
    'orderId':1,     // leave this one for the create action
    'request': 1,
    'reviews':1,
    'rebookUrl': 1,
    'chat': 1,
    'chatSyncOptions': 1,
    'slackin': 1,
  },
  listIndex: {
    '_id': 1,
    'type': 1,
    'minutes': 1,
    'status':1,
    'datetime':1,
    'participants.role':1,
    'participants.info':1,
    // 'recordings':1,
    // 'paidout':1
    'expertId': 1,
    'requestId': 1,
    'rebookUrl': 1
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
  expertMatching: {
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
      p.chat = p.chat || { slack: Slack.checkUserSync(p.info) }
      if (p.chat.slack == null) delete p.chat
    }
  },
  inflateChatInfo(chat) {
    if (!chat || !chat._id) return
    chat.members = {}
    for (var m of chat.info.members||[])
      if (!_.contains([pairbot.id,jk.id,support.id],m))
        chat.members[m] = Slack.checkUserSync({id:m}) || {id:m}
    chat.history = filterSlackHistory(chat.history)
  },
  slackMsgTemplateData(b, extraData, meId) {
    select.inflateParticipantInfo(b.participants)
    var tmplData = {
      status: b.status,
      bookingId: b._id,
      minutes: b.minutes,
      customer: participantSlackHandle(customers(b)[0]),
      expert: participantSlackHandle(experts(b)[0]),
      multitime: multitime(b)
    }
    if (meId && tmplData.customer && tmplData.expert) {
      var me = _.find(b.participants,(p)=>_.idsEqual(p.info._id,meId))
      tmplData.me = participantSlackHandle(me)
      if (tmplData.me == tmplData.customer) tmplData.them = tmplData.expert
      if (tmplData.me == tmplData.expert) tmplData.them = tmplData.customer
    }

    return (extraData) ? _.extend(tmplData,extraData) : tmplData
  },
  cb: {
    inflate(cb, selectFields) {
      var inflateSelect = (b) => {
        select.inflateParticipantInfo(b.participants)
        select.inflateChatInfo(b.chat)
        b.rebookUrl = rebookUrl(b)
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
    listIndex(cb) {
      return (e,r) => {
        if (e) return cb(e)
        for (var b of r || []) {
          //-- rebookUrl not handling requests
          b.rebookUrl = rebookUrl(b)
          for (var p of (b.participants || []))
            p.info.avatar = md5.gravatarUrl(p.info.email)
        }
        cb(e,r)
      }
    },
    itemIndex(cb) {
      return (e,r) => {
        if (e) return cb(e)
        if (r.order) {
          for (var li of r.order.lineItems) {
            if (li.info) {
              if (li.info.paidout != null) r.order.paidout = li.info.paidout
              if (li.info.released != null) r.order.released = li.info.released
            }
            else if (moment(r.datetime).isBefore(moment("20150101","YYYYMMDD")))  {
              r.order.isV0 = true
              li = { info: { paidout: true, released: true } }
              r.order = _.extend(r.order, {paidout:true, release: true })
              r.status = "complete"
            }
          }

          delete r.order.lineItems
        }
        if (r.recordings && r.recordings.length > 0)
        {
          for (var rec of r.recordings)
            if (!rec.data.youTubeId)
              rec.data.youTubeId = rec.data.id
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
      'chatId': '_id type provider providerId',
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
