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
      // 'orderId':1
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
