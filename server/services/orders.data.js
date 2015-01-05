module.exports = {

  select: {
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
