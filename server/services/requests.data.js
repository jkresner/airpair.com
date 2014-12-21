import Rates  from '../services/requests.rates'
import * as md5           from '../util/md5'
var util =    require('../../shared/util')
var Roles =   require('../../shared/roles.js')

var selectFields = {
  anon: {
    '_id': 1,
    'by.avatar': 1,
    'type': 1,
    'brief': 1,
    'tags': 1,
    'time': 1,
    'experience': 1
  },
  review: {
    '_id': 1,
    'by': 1,
    'type': 1,
    'brief': 1,
    'tags': 1,
    'time': 1,
    'hours': 1,
    'experience': 1,
    'status': 1,
    'suggested': 1
  },
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
  pipeline: {
    '_id': 1,
    'userId': 1,
    'by': 1,
    'type': 1,
    'tags.slug': 1,
    'time': 1,
    // 'hours': 1,
    // 'experience': 1,
    'status': 1,
    'budget': 1,
    'suggested.expert.email': 1
  }
}


function migrateV0(r) {
  if (!r.by && r.company)
  {
    var c = r.company.contacts[0]
    r.by = { name:c.fullName, email:c.gmail, avatar: md5.gravatarUrl(c.gmail) }
    for (var t of r.tags) t.slug = t.short
  }
  if (!r.time) r.time = 'regular'
  if (!r.experience) r.experience = 'proficient'

  return r
}


module.exports = {

  select: {
    anon: selectFields.anon,
    review: selectFields.review,
    customer: selectFields.customer,
    meSuggested(r, userId) {
      var sug = _.find(r.suggested,(s)=>_.idsEqual(userId,s.expert.userId))
      return (sug) ? [sug] : []
    },
    byView(request, view) {
      var r = migrateV0(request)
      if (r.suggested)
        for (var s of r.suggested) s.expert.avatar = md5.gravatarUrl(s.expert.email)
      Rates.addRequestSuggestedRates(r, true)
      r = util.selectFromObject(r, selectFields[view])
      // $log('selected', view, request.suggested, r)
      return r
    }
  },

  query: {
    // submitted: function(andCondition) {
    //   var query = [
    //     {'budget' : { '$exists': true }} //,
    //     //{'published': { '$lt': new Date() }}
    //   ]

    //   if (andCondition) query.push(andCondition)

    //   return { '$and': query }
    // },

    incomplete: {
      'budget' : { '$exists': false }, status: { $in: ['received'] }
    },

    active: {
      // 'budget' : { '$exists': true },
      // status: { $in: ['received','waiting','review','scheduled','consumed'] }
      'adm.active': true
    }

  }

}
