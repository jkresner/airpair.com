import Svc                from '../services/_service'
import * as Validate      from '../../shared/validation/experts.js'
import Expert             from '../models/expert'
import Request            from '../models/request'
import * as md5           from '../util/md5'
var util =                require('../../shared/util')
var Data =                require('./experts.data')
var logging = false
var svc = new Svc(Expert, logging)


var get = {
  getById(id, cb) {
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      r.avatar = md5.gravatarUrl(r.email)
      cb(null,r)
    })
  },
  getMe(cb) {
    svc.searchOne({userId:this.user._id}, null, (e,r) => {
      if (e || !r) return cb(e,r)
      r.avatar = md5.gravatarUrl(r.email)
      cb(null,r)
    })
  },
  getForExpertsPage(cb) {
    var d = Data.data.getForExpertsPage
    d.experts.forEach(function(exp) { exp.rate = exp.rate + 40 })
    cb(null, d)
  },
  search(term, cb) {
    var searchFields = ['name','email','username','gh.username','tw.username']
    var and = { rate: { '$gt': 0 } }
    svc.search(term, searchFields, 5, Data.select.search, and, (e,r) => {
      if (r) {
        for (var exp of r) {
          exp.avatar = md5.gravatarUrl(exp.email)
          // if (exp.bookMe && exp.bookMe.urlSlug && !exp.username)
          //   exp.username = exp.bookMe.urlSlug
        }
      }
      cb(e,r)
    })
  },
  getMatchesForRequest(request, cb) {
    // todo protect with owner of request?
    var tagIds = _.map(request.tags,(t) => t._id.toString())
    var query = {
      'tags._id': { $in: tagIds }
      // rate: { $lt: request.budget }
    }
    // $log('query', query, tagIds)
    var opts = {fields:Data.select.matches, options: { limit: 1000 } }

    svc.searchMany(query, opts, (e,experts) => {
      if (e || !experts || experts.length == 0) return cb(e,experts)

      var existingExpertIds = []
      for (var s of request.suggested)
        existingExpertIds.push(s.expert._id)

      var existing = []
      for (var exp of experts) {
        exp.score = get.calcExpertScore(exp,request.tags)
        exp.avatar = md5.gravatarUrl(exp.email)
        if (_.find(existingExpertIds,(id)=>_.idsEqual(id,exp._id)))
          existing.push(exp)
      }
      var unique = _.difference(experts, existing)

      cb(null, _.take(_.sortBy(unique,(u)=>u.score).reverse(),50))
    })
  },
  calcExpertScore:(expert, tagsToScore) => {
    var tagScore = 0
    var tagMatchCount = 0
    var expertTags = _.where(expert.tags,(t)=>t._id)
    // $log('exper tags', expertTags)
    for (var tag of tagsToScore) {
      // $log('tagToScore', tag._id)
      var match = _.find(expertTags,(t)=>_.idsEqual(t._id,tag._id))
      if (match) {
        tagMatchCount = tagMatchCount+1
        tagScore = tagScore + (5 - tag.sort)*2
      }
    }
    tagScore = (tagScore + tagMatchCount * 2)*100

    var matchingScore = 0
    if (expert.matching)
    {
      matchingScore = expert.matching.replies.replied + expert.matching.experience.customers
    }
    matchingScore = matchingScore*200

    var socialScore = 0;
    if (expert.gh) socialScore += Math.floor(expert.gh.followers/10)
    if (expert.so) socialScore += socialScore + Math.floor(expert.so.reputation/100)
    // if (expert.tw) socialScore += socialScore + Math.floor(expert.tw.followers)
    // if (expert.in) socialScore += socialScore + Math.floor(expert.in.endorsements)
    // if (expert.bb) socialScore += socialScore + Math.floor(expert.bb.followers)

    // $log('expert', expert.name, tagScore, matchingScore, socialScore)
    return tagScore + matchingScore + socialScore
  }
}

var save = {
  updateMatchingStats(expertId, request, cb) {
    get.getById(expertId, (e,expert) => {
      if (e || !expert) cb(e)
      //-- TODO migrate request.calls to bookings
      // var q = { '$or': [{'suggested.expert._id':expertId},{'calls.expertId':expertId}]}
        // .elemMatch('suggested', { 'expert._id': expertId })
      Request
        .find({'suggested.expert._id':expertId},{_id:1,userId:1,suggested:1,calls:1}, (e,requests) => {
          var expertSuggestions = []
          var expertCalls = []
          var replied = 0
          var lastSuggest = null
          var lastReply = null
          var hours = 0
          var customerIds = []
          for (var r of requests) {
            var expertSuggestion = _.find(r.suggested,(s)=>_.idsEqual(s.expert._id,expertId))
            expertSuggestions.push(_.extend(expertSuggestion,{requestId:r._id}))
            if (!lastSuggest || expertSuggestion._id > lastSuggest._id)
              lastSuggest = util.ObjectId2Date(expertSuggestion._id)
            if (expertSuggestion.expertStatus != 'waiting') {
              replied = replied + 1
              if (!lastReply || expertSuggestion._id > lastReply._id) lastReply =
                util.ObjectId2Date(expertSuggestion._id)
            }

            var calls = _.where(r.calls,(c)=>_.idsEqual(c.expertId,expertId))
            for (var call of calls) {
              customerIds = _.union(customerIds, [r.userId])
              expertCalls.push(_.extend(call,{requestId:r._id}))
              hours = hours + call.duration
            }
          }

          var map = function(s) {
            var d =
            {
              replied:util.ObjectId2Date(s._id),
              status:s.expertStatus,
              comment:s.expertComment,
              requestId:s.requestId
            };
            return d
          }

          var last10 = _.map(_.take(_.sortBy(expertSuggestions,(s)=>s._id).reverse(), 10), map)
          var customers = _.unique(_.pluck(expertCalls,''))

          var matching = {
            replies: {
              suggested: requests.length,
              replied, lastSuggest, lastReply, last10
            },
            experience: {
              hours, customers: customerIds.length
            }
          }

          // $log('updaing', expert._id, matching.replies.last10, matching)
          svc.update(expert._id, _.extend(expert, {matching}), (e,r)=>{
            if (r) r.avatar = md5.gravatarUrl(r.email)
            r.score = get.calcExpertScore(r,request.tags)
            cb(e,r)
          })
        })
    })
  },
  deleteById(id, cb) {
    svc.getById(id, (e, r) => {
      var inValid = Validate.deleteById(this.user, r)
      if (inValid) return cb(svc.Forbidden(inValid))
      svc.deleteById(id, cb)
    })
  }
}

module.exports = _.extend(get, save)
