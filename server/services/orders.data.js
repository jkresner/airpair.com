var {selectFromObject}    = require('../../shared/util')
import * as md5           from '../util/md5'


var base = {
  'opensource': 20,
  'private': 30
}

var select = {
  listAdmin: {
    'userId': 1,
    'by': 1,
    'utc': 1,
    'total': 1,
    'owner':1,
    'profit':1,
    'lineItems.type':1,
    'lineItems.info.name':1,
    'lineItems.info.type':1,
    'lineItems.info.source':1,
    'lineItems.total' :1,
    'company.contacts.fullName':1,
    'company.contacts.email':1
  },
  listPayout: {
    'userId': 1,
    'by': 1,
    'utc': 1,
    'lineItems.type':1,
    'lineItems.info.source':1,
    'lineItems.info.paidout':1,
    'lineItems.info.expert':1,
    'lineItems.info.released':1,
    'lineItems.owed':1,
  },
  forPayout(cb) {
    return (e, r) => {
      var selected = []
      if (e) return cb(e)
      for (var order of r) {
        for (var line of order.lineItems)
        {
          if (line.type != 'airpair')
            order.lineItems = _.difference(order.lineItems, [line])
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

var query = {
  creditRemaining: function(userId, payMethodId) {
    return {
      '$or': [{payMethodId},{userId,payMethodId:null}],
      '$and': [
          {'lineItems.info' : { '$exists': true }},
          {'lineItems.info.remaining': { '$gt': 0 }}
      ] }
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
  orderByNewest: { sort: { 'utc': 1 } },
  orderByOldest: { sort: { 'utc': -1 } }
}

module.exports = {base,select,query,opts}
