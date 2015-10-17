var { Expert,Booking,
            User,Request }   = DAL
var MatchGroup               = require('../models/matchgroup')
var md5                      = require('../util/md5')
var {ObjectId2Date}          = util
var {select,query}           = require('./experts.data')


var get = {

  getForExpertsPage(cb) {
    cb(Error("getForExpertsPage not implemented"))
  },

  /// VERY TEMPORARY SOLUTIOn
  getMatchesForDashboard(cb) {
    cb(V2DeprecatedError("Mojo.getMatchesForDashboard"))
    //tags, bookmarks, requests,
  //   require('../models/user').findOne({_id:this.user._id}, (e,user) =>{
  //       var tags = _.map(user.tags,(t)=>{return { _id: t.tagId } })
  //       get.getMatchesForRequest({tags,suggested:[]}, (e,r) => {
  //         r = _.take(r, 2)
  //         if (r[0]) r[0].tags = _.take(_.pluck(r[0].tags,'short'), 3)
  //         if (r[1]) r[1].tags = _.take(_.pluck(r[1].tags,'short'), 3)
  //         cb(null, r)
  //       })
  //     })
  },

  getRanked(meExpert, q, cb) {
    var exclude = q.exclude || []
    var tags = q.tags.map(tid=>cache.tags[tid])
    var budget = q.budget || 0
    var includeBusy = q.includeBusy

    // $log('query.ranked(tags,exclude,0,includeBusy) }', query.ranked(tags,exclude,0,includeBusy))

    Expert.aggregate([
        { $match: query.ranked(tags,exclude,0,includeBusy) } /* Query can go here, if you want to filter results. */
      , { $project: _.extend({ common: { $setIntersection: ['$tags._id',tags] } }, select.matches) } /* select the tokens field as something we want to "send" to the next command in the chain */
      , { $project: _.extend({ common:1, primary: { $setIntersection: ['$tags._id',[tags[0]]] } }, select.matches) } /* select the tokens field as something we want to "send" to the next command in the chain */
      , { $project: _.extend({ commonLen: { $size: '$common' }, primaryLen: { $size: '$primary' } }, select.matches) }
      , { $sort: { commonLen: -1, primaryLen: -1 } }
      , { $limit: 200 }
    ], (e, experts) => {
      if (e || !experts || experts.length == 0) return cb(e,experts)
      // $log('prim', experts.map(ex=>ex.userId))
      User.getManyById(experts.map(ex=>ex.userId), {select:select.mojoUser}, (ee, rr) =>{
        var userHash = {}
        for (var u of rr) userHash[u._id] = u
        for (var exp of experts) exp.user = userHash[exp.userId]

        select.cb.inflateList((e, inflated) => {
          // $log('inflated', exclude, inflated)
          for (var exp of inflated) {
            exp.score = get.calcMojo(exp, q.tags)
            // $log('exp.score', exp.score)
          }

          var filtered = inflated.filter(exp=>exclude.indexOf(exp.username)==-1)
          var sorted = _.sortBy(filtered, u => u.score).reverse()
          var results = _.take(sorted, 100)
          // $log('experts', results)
          cb(null, results)
        })(ee, experts)
      })
    })
  },


  getGroupMatch(tags, q, cb) {
    var filterQ = (group) =>
      _.take(_.filter(group.suggested,(s) =>
        s.minRate <= q.maxRate  &&
        !_.contains(q.exclude,s._id)), q.take)

    var groupMatch = (tag) => {
      var {slug} = tag
      if (MatchGroup[slug])
        return { tag, type: 'primary', suggested: filterQ(MatchGroup[slug]) }
      else
        for (var mg of _.values(MatchGroup))
        {
          if (_.contains(mg.auto, slug))
            return { tag, type: 'auto', suggested: filterQ(mg) }
          else if (_.contains(mg.manual, slug))
            return { tag, type: 'manual', suggested: filterQ(mg) }
        }
    }

    for (var tag of tags) {
      var group = groupMatch(tag)
      if (group && group.suggested.length > 0)
        return cb(null, group)
    }
    cb()
  },

  //  requirements
  //  experience
  //  engagement
  //    -- Should award new people
  //  social
  //  internal
  calcMojo(expert, tagIdsOrdered) {
    var requirements = 0
    var tagMatchCount = 0
    var tagSort = 0
    // $log('exper tags', expertTags)
    for (var tag of tagIdsOrdered) {
      var match = _.find(expert.tags,(t)=>_.idsEqual(t._id,tag))
      // $log('tagToScore', expert, tag, expert.tags.length, match)
      if (match) {
        tagMatchCount = tagMatchCount+1
        requirements = requirements + (10 - tagSort)*20
      }
      tagSort = tagSort+3 // TODO, increment outside conditional
    }
    requirements = (requirements + tagMatchCount * 30)*200

    var engagement = 0
    var experience = 0
    if (expert.matching)
    {
      engagement = expert.matching.replies.replied
      experience = expert.matching.experience.customers * 10
                 + expert.matching.experience.hours * 2
    }
    engagement = engagement*200
    experience = experience*200

    var social = 0;

    // $log('calcMojo'.blue, requirements, expert.gh, expert.so)
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


var calcMatching = (expert, cb) => {
  Booking
    .getManyByQuery({'expertId':expert._id}, {
      select: '_id expertId minutes datetime status participants.info participants.role'
    }, (ee,bookings) => {
  Request
    .getManyByQuery({'suggested.expert._id':expert._id}, {
        select:'_id userId suggested'}, (e,requests) => {
      var expertSuggestions = []
      var expertCalls = []
      var replied = 0
      var lastSuggest = null
      var lastReply = null
      var hours = Math.round(_.reduce(_.pluck(bookings,'minutes'), (m, n) => m + n, 0)/60)
      var customerIds = _.uniq(_.pluck(bookings,'expertId'))
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

      var customers = _.unique(_.pluck(expertCalls,''))
      cb( e||ee, {
        replies: {
          suggested: requests.length,
          replied, lastSuggest, lastReply,
          last10: _.map(_.take(_.sortBy(expertSuggestions,(s)=>s._id).reverse(), 10), map)
        },
        experience: {
          hours,
          customers: customerIds.length,
          last10: _.take(_.sortBy(bookings,(b)=>b._id).reverse(), 10)
        }
      })
    })
  })
}



var save = {

  updateAllStats() {
    var updateOne = function(exp) {
      calcMatching(exp, (e, matching) => {
        $log('matching'.cyan, (exp.name) ? exp.name : exp.user.name, exp.rate, matching.experience.last10.length)
        Expert.update({_id:exp._id},{$set:{matching}}, {},
          (e,r)=>$log('updated'.yellow, e, (exp.name) ? exp.name : exp.user.name))
      })
    }

    Expert.find({rate:{'$gt':0}},(e,r) => {
      // $log('experts'.cyan, r.length)
      for (var exp of r)
        updateOne(exp)
    })
  },

  updateMatchingStats(expert, request, cb) {
    calcMatching(expert, (e, matching) => {
      // $log('updaing.matching', expert._id, expert.tags, matching.replies.last10, matching)
      Expert.updateSet(expert._id, {matching}, (e, update)=>{
        if (e) return cb(e)
        expert.matching = matching
        expert.score = get.calcMojo(expert,request.tags)

        var d = {
          tagsString:util.tagsString(request.tags), expertFirstName: util.firstName(expert.name),
          requestByFullName:request.by.name,_id:request._id,accountManagerName:this.user.name,
          // suggested: matching.replies.suggested.length,
          // isFirstSuggest: matching.replies.suggested.length == 0,
        }
        mailman.get('expert-suggest', d, (ee,rr) => {
          if (rr) expert.suggest = { subject: rr.subject, markdown: rr.markdown }
          cb(e,expert)
        })
      })
    })
  }
}



module.exports = _.extend(get, save)
