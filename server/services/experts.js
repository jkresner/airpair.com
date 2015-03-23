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
    svc.getById(id,(e,r)=>{
      if (e||!r) return cb(e,r)
      cb(null,selectCB.migrateInfate(r))
    })
  },
  getMe(cb) {
    svc.searchOne({userId:this.user._id}, null, selectCB.me((e,r)=>{
      if (!e && !r) return cb(null, {user:selectFromObject(this.user, select.userCopy)})
      cb(e,r)
    }))
  },
  search(term, cb) {
    var searchFields = [
      'user.name','user.email','user.username',
      'name','email','username',
      'gh.username','tw.username',
      'user.social.gh.username','user.social.tw.username'
      ]
    var and = { rate: { '$gt': 0 } }
    svc.search(term, searchFields, 5, Data.select.search, and, (e,r) => {
      if (r) {
        for (var exp of r) {
          if (exp.user) {
            exp.name = exp.user.name
            exp.email = exp.user.email
            exp.username = exp.user.username
          }
          exp.avatar = md5.gravatarUrl(exp.email)
        }
      }
      cb(e,r)
    })
  },
  getNewForAdmin(cb) {
    cache.ready(['tags'], () => {
      var opts = { options: { limit: 150, sort: { '_id': -1 }  } }
      svc.searchMany({}, opts, (e,r)=>{
        for (var expert of r) {
          expert.tags = selectCB.inflatedTagsNoCB(expert)
          expert.user.avatar = md5.gravatarUrl(expert.user.email)
        }
        cb(e,r)
      })
    })
  }
}

function updateWithTouch(expert, action, trackData, cb) {
  var previousAction = (expert.lastTouch) ? expert.lastTouch.action : null
  if (action != previousAction ||
    moment(expert.lastTouch.utc).isBefore(moment().add(1, 'hours')))
  {
    expert.lastTouch = svc.newTouch.call(this, action)
    expert.activity = expert.activity || []
    expert.activity.push(expert.lastTouch)
  }

  var tagIdx = 0
  for (var t of expert.tags) {
    if (!t.sort)
      t.sort = tagIdx
    tagIdx = tagIdx + 1
  }

  //-- consistency with v0 + save db space
  if (expert.user.social) {
    if (expert.user.social.so)
      expert.user.social.so.link = expert.user.social.so.link.replace('http://stackoverflow.com/users/','')
    if (expert.user.google) {
      expert.user.social.gp = expert.user.google
      delete expert.user.google
    }
  }

  if (action == 'create')
    svc.create(expert, cb)
  else {

    if (expert.gp || expert.gh || expert.so || expert.bb ||
      expert.in || expert.tw || expert.name || expert.username ||
      expert.gmail || expert.timezone || expert.location ||
      expert.homepage || expert.karma)
    {
      svc.updateWithUnset(expert._id, select.v0unset, (e,r)=>{})
      expert = _.omit(expert, _.keys(select.v0unset))
      $log(`Migrating v0 expert ${expert._id} ${expert.user.name}`.yellow)
    }

    svc.update(expert._id, expert, cb)
  }

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
    $callSvc(UserSvc.setExpertCohort, this)(ups._id)
  },

  deleteById(id, cb) {
    svc.getById(id, (e, r) => {
      var inValid = Validate.deleteById(this.user, r)
      if (inValid) return cb(svc.Forbidden(inValid))
      svc.deleteById(id, selectCB.inflateTags(cb))
    })
  }
}

module.exports = _.extend(get, save)
