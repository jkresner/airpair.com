var {selectFromObject}    = require('../../shared/util')

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
  toPayout: {
    'userId': 1,
    'by': 1,
    'utc': 1,
    'lineItems.type':1,
    // 'lineItems.info.type':1,
    'lineItems.info.source':1,
    'lineItems.info.paidout':1,
    'lineItems.info.expert':1,
    'lineItems.owed':1,
  }
}


module.exports = {

  select: {
    listAdmin: select.listAdmin,
    toPayout:  select.toPayout,
    forPayout(cb) {
      return (e, orders) => {
        var selected = []
        if (e) return cb(e)
        for (var order of orders) {
          for (var line of order.lineItems)
          {
            if (line.type != 'airpair')
              order.lineItems = _.difference(order.lineItems, [line])
            else {
              line.owed = line.total - line.profit
            }
          }
          selected.push(selectFromObject(order, select.toPayout))
        }
        cb(null,selected)
      }
    }
  },

  query: {
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
  },

  options: {
    orderByDate: { sort: { 'utc': -1 } }
  }

}
