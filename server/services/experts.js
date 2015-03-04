import Svc                from '../services/_service'
import * as Validate      from '../../shared/validation/experts.js'
import Expert             from '../models/expert'
import Request            from '../models/request'
import * as md5           from '../util/md5'
var {ObjectId2Date,
  selectFromObject}       = require('../../shared/util')
var Data                  = require('./experts.data')
var {select}              = Data
var selectCB              = select.cb
var logging               = false
var svc                   = new Svc(Expert, logging)
var UserSvc               = require('../services/users')

var get = {
  getById(id, cb) {
    svc.getById(id,selectCB.addAvatar(cb))
  },
  getMe(cb) {
    svc.searchOne({userId:this.user._id}, null, selectCB.me(cb))
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

  /// VERY TEMPORARY SOLUTIOn
  getMatchesForDashboard(cb) {
    //tags, bookmarks, requests,
    require('../models/user').findOne({_id:this.user._id}, (e,user) =>{
        var tags = _.map(user.tags,(t)=>{return { _id: t.tagId } })
        get.getMatchesForRequest({tags,suggested:[]}, (e,r) => {
          r = _.take(r, 2)
          if (r[0]) r[0].tags = _.take(_.pluck(r[0].tags,'short'), 3)
          if (r[1]) r[1].tags = _.take(_.pluck(r[1].tags,'short'), 3)
          cb(null, r)
        })
      })
  },
  getMatchesForRequest(request, cb) {
    // todo protect with owner of request?
    var tagIds = _.map(request.tags,(t) => t._id.toString())
    var query = {
      'tags._id': { $in: tagIds }
      // rate: { $lt: request.budget }
    }
    // $log('query', query)
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
        tagScore = tagScore + (5 - tag.sort)*20
      }
    }
    tagScore = (tagScore + tagMatchCount * 30)*200

    var matchingScore = 0
    if (expert.matching)
    {
      matchingScore = expert.matching.replies.replied + expert.matching.experience.customers
    }
    matchingScore = matchingScore*200

    var socialScore = 0;
    if (expert.gh) socialScore += Math.floor(expert.gh.followers/20)
    if (expert.so) socialScore += socialScore + Math.floor(expert.so.reputation/150)
    // if (expert.tw) socialScore += socialScore + Math.floor(expert.tw.followers)
    // if (expert.in) socialScore += socialScore + Math.floor(expert.in.endorsements)
    // if (expert.bb) socialScore += socialScore + Math.floor(expert.bb.followers)

    // $log('expert', expert.name, tagScore, matchingScore, socialScore)
    return tagScore + matchingScore + socialScore
  }
}

// Lost the updateWithTouch

function updateWithTouch(expert, action, trackData, cb) {
  var previousAction = (expert.lastTouch) ? expert.lastTouch.action : null
  if (action != previousAction ||
    moment(expert.lastTouch.utc).isBefore(moment().add(1, 'hours')))
  {
    expert.lastTouch = svc.newTouch.call(this, action)
    expert.activity = expert.activity || []
    expert.activity.push(expert.lastTouch)
  }

  if (action == 'create')
    svc.create(expert, cb)
  else
    svc.update(expert._id, expert, cb)

  if (trackData)
    analytics.track(this.user, this.sessionID, 'Save',
      _.extend(trackData,{type:expert,action}), {}, ()=>{})
}


var save = {

  create(expert, cb) {
    var trackData = { name: this.user.name }
    expert.user = selectFromObject(this.user, select.userCopy)
    expert.userId = this.user._id
    $callSvc(updateWithTouch, this)(expert, 'create', trackData, (e,r) => {
      if (r._id)
        $callSvc(UserSvc.setExpertCohort, this)(r._id)
      selectCB.me(cb)(e,r)
    })
  },

  updateMe(original, ups, cb) {
    var trackData = { name: this.user.name, _id: original._id }
    ups.user = selectFromObject(this.user, select.userCopy)
    var expert = selectFromObject(_.extend(original,ups), select.updateMe)
    $callSvc(updateWithTouch, this)(expert, 'update', trackData, selectCB.me(cb))
    if (!this.user.cohort.expert || this.user.cohort.expert._id != ups._id)
      $callSvc(UserSvc.setExpertCohort, this)(ups._id)
  },

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
              lastSuggest = ObjectId2Date(expertSuggestion._id)
            if (expertSuggestion.expertStatus != 'waiting') {
              replied = replied + 1
              if (!lastReply || expertSuggestion._id > lastReply._id) lastReply =
                ObjectId2Date(expertSuggestion._id)
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
              replied:ObjectId2Date(s._id),
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
