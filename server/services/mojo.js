import Svc                from '../services/_service'
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

var get = {

  getForExpertsPage(cb) {
    cb(Error("getForExpertsPage not implemented"))
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

  getRanked(meExpert, query, cb) {
    // $log('getRanked', query)
    var search = { 'tags._id': { $in: query.tags } }
    if (query.exclude) {
      search['username'] = { $nin: query.exclude }
      search['user.username'] = { $nin: query.exclude }
    }

    // if (query.rate)
    // rate: { $lt: request.budget }

    var opts = {fields:Data.select.matches, options: { limit: query.limit } }
    // $log('search', search, 'limit', query.limit)
    svc.searchMany(search, opts, selectCB.inflateList((e, experts) => {
        if (e || !experts || experts.length == 0) return cb(e,experts)
        for (var exp of experts)
          exp.score = get.calcMojo(exp,query.tags)
        cb(null, _.take(_.sortBy(experts,(u)=>u.score).reverse(),75))
    }))
  },


  //  requirements
  //  experience
  //  engagement
  //    -- Should award new people
  //  social
  //  internal
  calcMojo(expert, tagIdsOrdered) {
    // $log('calcMojo'.blue)
    var requirements = 0
    var tagMatchCount = 0
    var tagSort = 0
    // $log('exper tags', expertTags)
    for (var tag of tagIdsOrdered) {
      // $log('tagToScore', expert._id, tag, expert.tags.length)
      var match = _.find(expert.tags,(t)=>_.idsEqual(t._id,tag))
      // $log('match'.cyan)
      if (match) {
        tagMatchCount = tagMatchCount+1
        requirements = requirements + (5 - tagSort)*20
        tagSort = tagSort+1 // TODO, increment outside conditional
      }
    }
    requirements = (requirements + tagMatchCount * 30)*200

    var engagement = 0
    var experience = 0
    if (expert.matching)
    {
      engagement = expert.matching.replies.replied
      experience = expert.matching.experience.customers
    }
    engagement = engagement*200
    experience = experience*200

    var social = 0;
    // $log('social', expert._id, expert.gh)
    if (expert.gh) social += Math.floor(expert.gh.followers/20)
    if (expert.so) social += social + Math.floor(expert.so.reputation/150)
    // if (expert.tw) socialScore += socialScore + Math.floor(expert.tw.followers)
    // if (expert.in) socialScore += socialScore + Math.floor(expert.in.endorsements)
    // if (expert.bb) socialScore += socialScore + Math.floor(expert.bb.followers)

    var internal = 0

    // $log('expert'.cyan, expert, requirements, experience, engagement, social, internal)
    return requirements + experience + engagement + social + internal
  }
}



var save = {

  updateMatchingStats(expert, request, cb) {
    Request
      .find({'suggested.expert._id':expert._id},{_id:1,userId:1,suggested:1}, (e,requests) => {
        var expertSuggestions = []
        var expertCalls = []
        var replied = 0
        var lastSuggest = null
        var lastReply = null
        var hours = 0
        var customerIds = []
        for (var r of requests) {
          var expertSuggestion = _.find(r.suggested,(s)=>_.idsEqual(s.expert._id,expert._id))
          expertSuggestions.push(_.extend(expertSuggestion,{requestId:r._id}))
          if (!lastSuggest || expertSuggestion._id > lastSuggest._id)
            lastSuggest = ObjectId2Date(expertSuggestion._id)
          if (expertSuggestion.expertStatus != 'waiting') {
            replied = replied + 1
            if (!lastReply || expertSuggestion._id > lastReply._id)
              lastReply = ObjectId2Date(expertSuggestion._id)
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

        // $log('updaing', expert._id, expert.tags, matching.replies.last10, matching)
        svc.update(expert._id, _.extend(expert, {matching}), (e,r)=>{
          if (r) r.avatar = md5.gravatarUrl(r.email||r.user.email)
          r.score = get.calcMojo(r,request.tags)
          r.tags = expert.tags

          var d = { tagsString:util.tagsString(request.tags), expertFirstName: util.firstName(expert.name),
            requestByFullName:request.by.name,_id:request._id,accountManagerName:this.user.name }
          mailman.get('expert-suggest', d, (ee,rr) => {
            if (rr) r.suggest = { subject: rr.Subject, body: rr.Text }
            cb(e,r)
          })
        })
      })

  }
}

module.exports = _.extend(get, save)
