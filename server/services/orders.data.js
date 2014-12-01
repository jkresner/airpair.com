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
      return {  userId,
                '$and': [
                    {'lineItems.info' : { '$exists': true }},
                    {'lineItems.info.remaining': { '$gt': 0 }}
                ] }
    }
  },

  options: {
    ordersByDate: { sort: { 'utc': 1 } }
  }

}
