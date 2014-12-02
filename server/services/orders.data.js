module.exports = {

  select: {
    listAdmin: {
      'userId': 1,
      'by': 1,
      'utc': 1,
      'total': 1,
      'owner':1
    }
  },

  query: {
    creditRemaining: function(userId) {
      return {
        userId,
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
    ordersByDate: { sort: { 'utc': 1 } }
  }

}
