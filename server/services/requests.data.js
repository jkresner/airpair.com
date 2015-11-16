var Rates                 = require('../services/requests.rates')
var md5                   = require('../util/md5')
var Roles                 = require('../../shared/roles.js').request
var {ObjectId}            = require('mongoose').Schema

var inflatedTags = (tags) => {
  if (!tags || !tags.length) return []
  var inflatedTags = []
  for (var tag of tags||[]) {
    if (cache.tags[tag._id])
      inflatedTags.push(Object.assign(tag, _.pick(cache.tags[tag._id],'name','slug','short')))
  }
  return inflatedTags
}

function migrateV0(r) {
  if (r.budget)
  {
    // if (!r.by && r.company && r.company.contacts)
    // {
    //   var c = r.company.contacts[0]
    //   r.by = { name:c.fullName, email:c.gmail, avatar: md5.gravatarUrl(c.gmail) }
    //   for (var t of r.tags) t.slug = t.short
    // }
    if (!r.time) r.time = 'regular'
    if (!r.experience) r.experience = 'proficient'
    if (r.owner && (!r.adm || !r.adm.owner))
    {
      if (!r.adm) r.adm = { owner: r.owner }
      else r.adm.owner = r.owner
    }
  }
  if (r.adm && r.adm.lastTouch && !r.adm.lastTouch.utc)
    r.adm.lastTouch = { utc: r.adm.lastTouch }

  return r
}

var statusHash =
  {'available':1,'underpriced':2,'busy':3,'abstained':4,'opened':5,'waiting':6 }
//chosen , // released


var hexSeconds = Math.floor(moment('20141220','YYYYMMDD')/1000).toString(16)
var id2015 = new ObjectId(hexSeconds + "0000000000000000").path

var data = {

  select: {
    anon: {
      '_id': 1,
      'by.avatar': 1,
      'type': 1,
      'brief': 1,
      'tags': 1,
      'time': 1,
      'experience': 1,
      'title': 1
    },
    review: {
      '_id': 1,
      'userId': 1,
      'by': 1,
      'type': 1,
      'brief': 1,
      'tags': 1,
      'time': 1,
      'hours': 1,
      'experience': 1,
      'status': 1,
      'suggested': 1,
      'title': 1
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
      'suggested': 1,
      'title': 1
    },
    pipeline: {
      '_id': 1,
      'userId': 1,
      'by': 1,
      'type': 1,
      'tags.slug': 1,
      'time': 1,
      'title': 1,
      // 'hours': 1,
      // 'experience': 1,
      'status': 1,
      'budget': 1,
      'suggested.expert.userId': 1,
      'suggested.expert.username': 1,
      'suggested.expert.email': 1,
      'suggested.expertStatus': 1,
      'lastTouch':1,
      'adm': 1
    },
    experts: {
      '_id':1,
      'title': 1,
      'userId':1,
      'by':1,
      'suggested':1,
      'calls._id':1,
      'calls.expertId':1,
      'calls.type':1,
      'calls.duration':1,
      'calls.datetime':1,
      'calls.status':1,
      'company.contacts.fullName':1,
      'company.contacts.email':1,
    },
    meSuggested(r, userId, expertId) {
      if (userId) $log('meSuggested no longer supports userId', userId)
      // $log('meSuggested'.yellow, r.suggested, userId, new ObjectId())
      if (expertId)
        var sug = _.find(r.suggested, s => _.idsEqual(expertId,s.expert._id))
      return sug ? [sug] : []
    },
    byView(request, view) {
      var r = migrateV0(request)
      r.tags = _.sortBy(r.tags,(t)=>t.sort)
      r.rags = inflatedTags(r.tags)
      if (r.suggested) {
        r.suggested = _.sortBy(r.suggested, (s)=>statusHash[s.expertStatus])
        for (var s of r.suggested) {
          if (s.expert.email)
            s.expert.avatar = md5.gravatarUrl(s.expert.email)
          if (!s.suggestedRate)
            Rates.addSuggestedRate(r, s, true)
          if (s.expert.userId && s.expert.userId.auth) {
            var {auth} = s.expert.userId
            if (auth.gh) s.expert.gh = { username: auth.gh.login }
            if (auth.so) s.expert.so = { link: auth.so.link }
            if (auth.bb) s.expert.bb = { id: auth.bb.id }
            if (auth.in) s.expert.id = { id: auth.in.id }
            if (auth.tw) s.expert.tw = { username: auth.tw.screen_name }
            s.expert.userId = s.expert.userId._id
          }
        }
      }

      if (view != 'admin')
        r = util.selectFromObject(r, data.select[view])
      // $log('selected', view, request.suggested, r)
      return r
    },
    expertToSuggestion(r, by, type, expertStatus) {
      // $log('expertToSuggestion', r, by)
      type = type || 'staff'
      expertStatus = expertStatus || 'waiting'


      // if (r.user) {
        // delete r.user._id
        // var social = r.user.social
        // how we handle staying v0 on front-end
        // r = _.extend(_.extend(r,r.user),r.social)
        // r.location = r.location.name
        // r.timezone = r.location.timeZoneId
      // }

      var _id = new require('mongoose').Types.ObjectId()
      var initials = (by.email.indexOf('@airpair.com')==-1) ? r.initials
        : by.email.replace('@airpair.com','')
      return {
        expertStatus,
        matchedBy: { _id, type, userId: by._id, initials },
        expert: {
          _id: r._id,
          email: r.email,
          userId: r.userId,
          name: r.name,
          location: r.location,
          timezone: r.timezone,
          avatar: r.avatar,
          rate: r.rate,
          tags: r.tags
        },
      }
    },
    template: {
      expertAutomatch(r, tagName) {
        return { _id: r._id, tag: tagName, requestByFullName: r.by.name }
      }
    },
    cb: {
      adm(cb) {
        return  (e,r) => {
          if (e) return cb(e)
          if (r.length) {
            for (var req of r) req = data.select.byView(req, 'admin')
          }
          else
            r = data.select.byView(r, 'admin')

          cb(null,r)
        }
      },
      byRole(ctx, errorCb, cb) {
        return (e, r) => {
          if (e || !r) return errorCb(e, r)

          if (!ctx.user) return cb(null, data.select.byView(r, 'anon'))
          else if (Roles.isCustomerOrAdmin(ctx.user, r)) {
            if (ctx.machineCall) cb(null, data.select.byView(r, 'admin'))
            else cb(null, data.select.byView(r, 'customer'))
          }
          else {
            //-- Yes this is not the right place for this ...
            var ExpertsSvc            = require('./experts')
            $callSvc(ExpertsSvc.getMe,ctx)((ee,expert) => {
              // -- we don't want experts to see other reviews
              r.suggested = data.select.meSuggested(r, ctx.user._id, expert._id)
              if (r.suggested.length == 0 && expert && expert.rate)
                r.suggested.push({expert})
              else if (r.suggested.length == 1 && !r.suggested[0].expert.userId) {
                // how we handle staying v0 on front-end
                r.suggested[0].expert.userId = ctx.user._id
                r.suggested[0].expert.rate = expert.rate
                r.suggested[0].expert.tags = expert.tags
                r.location = r.location
                r.timezone = r.timezone
              }
              else if (r.suggested.length > 1)
                throw Error("Cannot selectByExpert and have more than 1 suggested")

              cb(null, data.select.byView(r, 'review'))
            })
          }
        }
      },
      experts(ctx, cb) {
        return  (e,r) => {
          if (e) return cb(e)
          if (r.length) {
            for (var req of r) {
              req.suggested = data.select.meSuggested(req, ctx.user._id, ctx.expertId)
            }
          }
          cb(null,r)
        }
      },
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

    submittedInRange: function(start, end) {
     return {
        '$and': [
            {'adm.submitted': { '$gt': new Date(parseInt(start)) }},
            {'adm.submitted': { '$lt': new Date(parseInt(end)) }}
        ] }
    },

    experts(expert) {
      return {'suggested.expert._id':expert._id}
    },

    incomplete: {
      'budget' : { '$exists': false }, status: { $in: ['received'] }
    },

    active: {
      //
      // status: { $in: ['received','waiting','review','scheduled','consumed'] }
      'budget' : { '$exists': true }, 'adm.active': true, 'adm.submitted': { '$exists': true }
    },

    '2015': {
      'budget' : { '$exists': true }, '_id' : { '$gt': id2015 }
    },

    waiting: {
      'budget' : { '$exists': true }, 'adm.submitted': { '$exists': true },
      status: 'waiting'
    }

  }

}


module.exports = data
