var { Expert,
      Booking,
      User,
      Request }              = DAL
// var MatchGroup               = require('../models/matchgroup')
var {ObjectId2Date}          = util
var {select,query}           = require('./experts.data')


var get = {

  getForExpertsPage(cb) { cb(Error("getForExpertsPage not implemented")) },
  getMatchesForDashboard(cb) { cb(V2DeprecatedError("Mojo.getMatchesForDashboard")) },


  getRanked(meExpert, q, cb) {
    // console.log('getRanked.meExpert', meExpert)
    // console.log('getRanked.q.tags', q.tags)
    var exclude = q.exclude || []

    var tags = q.tags
    var budget = q.budget || 0
    var includeBusy = true //q.includeBusy

    var intersections = { overlap: { $setIntersection: ['$tags._id',tags.map(t=>t._id)] } }
    intersections.one = { $setIntersection: ['$tags._id',[tags[0]._id]] }
    intersections.two = tags[1] ? { $setIntersection: ['$tags._id',[tags[1]._id]] } : { $literal: [] }
    intersections.three = tags[2] ? { $setIntersection: ['$tags._id',[tags[2]._id]] } : { $literal: [] }

    Expert.aggregate([
      /* Query can go here, if you want to filter results. */
      { $match: query.ranked(tags,exclude,0,includeBusy) },
      /* select the tokens field as something we want to "send" to the next command in the chain */
      { $project: Object.assign(intersections, select.matches) },
      /* calculate a combine score weighting the tags in order */
      { $project: Object.assign({ tagScore: { $add: [
          { $size: '$overlap' },
          { $multiply: [10,{$size:'$one'}] },
          { $multiply: [6,{$size:'$two'}] },
          { $multiply: [2,{$size:'$three'}] }
        ]}}, select.matches) },
      { $sort: { tagScore: -1 } },
      { $limit: 150 }
    ], (e, experts) => {
      if (e || !experts || experts.length == 0) return cb(e,experts)

      User.getManyById(experts.map(ex=>ex.userId), {select:select.mojoUser}, (ee, rr) =>{
        var userHash = {}
        for (var u of rr) userHash[u._id] = u
        for (var exp of experts) Object.assign(exp, {user:userHash[exp.userId]})

        // $log('prim'.white, experts[0])
        select.cb.inflateList((e, inflated) => {
          // $log('inflated'.white, exclude, inflated[0])
          for (var exp of inflated) {
            exp.score = get.calcMojo(exp, q.tags)
            // $log('exp.score', exp.score, exp.name.gray, exp.primaryLen, exp.commonLen)
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
        s.availability.minRate <= q.maxRate  &&
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
    var requirements = 0     // tags + rate + availability
    var tagMatchCount = 0
    var tagSort = 0

    requirements = (expert.tagScore * 30)*500

    var engagement = 0
    var experience = 0
    if (expert.matching)
    {
      engagement = expert.matching.replies.replied
      experience = expert.matching.experience.customers * 10
                 + expert.matching.experience.hours * 2
    }
    engagement = engagement*100
    experience = experience*150

    var social = 0;

    // $log('calcMojo'.blue, requirements, expert.gh, expert.so)
    // $log('social', expert.bb, expert.in)
    if (expert.gh) social += Math.floor(expert.gh.followers/20)
    if (expert.so) social += social + Math.floor(expert.so.reputation/150)
    if (expert.tw) social += social + Math.floor(expert.tw.followers/40)
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
        // $log('matching'.cyan, (exp.name) ? exp.name : exp.user.name, exp.rate, matching.experience.last10.length)
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
