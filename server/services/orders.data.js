var {selectFromObject}    = require('../../shared/util')
var md5                   = require('../util/md5')
var ObjectId              = require('mongoose').Types.ObjectId

var base = {
  'opensource': 20,
  'private': 30
}

var select = {
  listAdmin: {
    '_id': 1,
    'userId': 1,
    'requestId': 1,
    'by': 1,
    'utc': 1,
    'total': 1,
    'owner':1,
    'profit':1,
    'lines.type':1,
    'lines.info.name':1,
    'lines.info.type':1,
    'lines.info.source':1,
    'lines.total' :1,
    'company.contacts.fullName':1,
    'company.contacts.email':1
  },
  listPayout: {
    '_id': 1,
    'userId': 1,
    'by': 1,
    'utc': 1,
    'lines._id':1,
    'lines.type':1,
    'lines.info':1,
    'lines.owed':1,
    'lines.bookingId':1,
  },
  listAdminReport: {
    '_id': 1,
    'userId': 1,
    'by': 1,
    'utc': 1,
    'total': 1,
    'profit':1,
  },
  cb: {
    forPayout(cb) {
      return (e, r) => {
        if (e) return cb(e)
        var selected = []
        for (var order of r) {
          for (var line of order.lines)
          {
            // v0 order (2013/2014)
            if (line.suggestion && line.suggestion.suggestedRate && line.type != 'credit') {
              line.owed = line.qty * line.suggestion.suggestedRate[line.type].expert
              line.info = {
                expert: line.suggestion.expert,
                paidout: true,
                minutes: line.qty*60,
                bookingIds: [],
                type: line.type,
                name: `${line.qty*60} min (${line.suggestion.expert.name})`,
                released: true
              }
              line.type = 'airpair'
              for (var c of line.redeemedCalls)
                line.info.bookingIds.push(c.callId)
            }
            else if (line.type != 'airpair')
              order.lines = _.difference(order.lines, [line])
            else {
              line.owed = line.total - line.profit
            }
          }
          selected.push(selectFromObject(order, select.listPayout))
        }
        cb(null,selected)
      }
    },
    forAdmin(cb) {
      return (e,r) => {
        for (var o of r) {
          if (o.company)
            o.by = { name: o.company.contacts[0].fullName, email: o.company.contacts[0].email }
          o.by.avatar = md5.gravatarUrl(o.by.email)
        }
        cb(null, r)
      }
    }
  }
}

var query = {
  creditRemaining: function(userId, payMethodId) {
    return {
      '$or': [{payMethodId},{userId,payMethodId:null}],
      '$and': [
          {'lines.type' : 'credit'},
          {'lines.info' : { '$exists': true }},
          {'lines.info.remaining': { '$gt': 0 }}
      ] }
  },
  dealMinutesRemaining: function(userId, dealId) {
    return {
      'userId':userId,
      'lines.type' : 'deal',
      'lines.info' : { '$exists': true },
      'lines.info.deal._id' : ObjectId(dealId.toString()),
      'lines.info.remaining': { '$gt': 0 }
    }
  },
  dealsForExpertWithMinutesRemaining: function(userId, expertId) {
    return {
      'userId': userId,
      'lines.type' : 'deal',
      'lines.info' : { '$exists': true },
      'lines.info.expert._id' : ObjectId(expertId.toString()),
      'lines.info.remaining': { '$gt': 0 }
    }
  },
  expertPayouts: function(expertId) {
    return {
       'lines.type' : { $ne: 'deal' },
       '$or': [
          {'lines.info.expert._id' : expertId},
          {'lines.info.expert._id' : expertId.toString()},
          {'lines.suggestion.expert._id' : expertId.toString(), paymentStatus: 'paidout' },
        ]
    }
  },
  inRange: function(start, end) {
   return {
      '$and': [
          {'utc': { '$gt': new Date(parseInt(start)) }},
          {'utc': { '$lt': new Date(parseInt(end)) }}
      ] }
  }
}

var opts = {
  byIdForAdmin:     { join: { 'lines.bookingId': '_id datetime participants' } },
  orderByNewest:    { sort: { 'utc': -1 }, join: { 'lines.bookingId': '_id datetime participants' } },
  orderByOldest:    { sort: { 'utc': 1 } }
}

module.exports = {base,select,query,opts}
