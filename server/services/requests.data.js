var util =    require('../../shared/util')
var Roles =   require('../../shared/roles.js')

var review = {
      '_id': 1,
      'by': 1,
      'type': 1,
      'brief': 1,
      'tags': 1,
      'time': 1,
      'hours': 1,
      'experience': 1,
      'status': 1
    };


module.exports = {

  select: {
    anon: {
      '_id': 1,
      'by.avatar': 1,
      'type': 1,
      'brief': 1,
      'tags': 1,
      'time': 1,
      'experience': 1
    },
    review,
    customer: {
      '_id': 1,
      'userId': 1,
      'by': 1,
      'brief': 1,
      'type': 1,
      'tags': 1,
      'time': 1,
      'hours': 1,
      'experience': 1,
      'status': 1,
      'budget': 1,
      'suggested': 1
    },
    meSuggested(r, userId) {
      var sug = _.find(r.suggested,(s)=>_.idsEqual(userId,s.expert.userId))
      return (sug) ? [sug] : []
    }
  },

  query: {
    submitted: function(andCondition) {
      var query = [
        {'budget' : { '$exists': true }} //,
        //{'published': { '$lt': new Date() }}
      ]

      if (andCondition) query.push(andCondition)

      return { '$and': query }
    }
  }

}
