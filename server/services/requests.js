import Svc                from '../services/_service'
import Rates              from '../services/requests.rates'
import * as ExpertsSvc    from './experts'
import * as Validate      from '../../shared/validation/requests.js'
import Request            from '../models/request'
import User               from '../models/user'
import * as md5           from '../util/md5'
var util =                require('../../shared/util')
var Data =                require('./requests.data')
var logging =             false
var svc =                 new Svc(Request, logging)
var {isCustomer,isCustomerOrAdmin,isExpert} = require('../../shared/roles.js').request

function selectByRoleCB(ctx, errorCb, cb) {
  return (e, r) => {
    if (e || !r) return errorCb(e, r)

    if (!ctx.user) return cb(null, Data.select.byView(r, 'anon'))
    else if (isCustomerOrAdmin(ctx.user, r)) cb(null, Data.select.byView(r, 'customer'))
    else {
      // -- we don't want experts to see other reviews
      r.suggested = Data.select.meSuggested(r, ctx.user._id)
      if (r.suggested.length == 1)
        return cb(null, Data.select.byView(r, 'review'))

      ExpertsSvc.getMe.call(ctx, (ee,expert) => {
        if (expert && expert.rate) r.suggested.push({expert})
        cb(null, Data.select.byView(r, 'review'))
      })
    }
  }
}

var get = {
  getByIdForAdmin(id, cb) {
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      User.findOne({_id:r.userId}, (ee,user) => {
        r.user = user
        return cb(ee,r)
      })
    })
  },
  getByIdForUser(id, cb) {  // for updating
    var userId = this.user._id
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      if (!isCustomerOrAdmin(this.user,r)) return cb(Error(`Could not find request[${id}] belonging to user[${userId}]`))
      cb (null, Data.select.byView(r, 'customer'))
    })
  },
  getByIdForReview(id, cb) {
    svc.getById(id, selectByRoleCB(this,cb,cb))
  },
  getByUserIdForAdmin(userId, cb) {
    var opts = { options: { sort: { '_id': -1 } } }
    svc.searchMany({userId}, opts, cb)
  },
  getMy(cb) {
    var opts = { options: { sort: { '_id': -1 } }, fields: Data.select.customer }
    svc.searchMany({userId:this.user._id}, opts, cb)
  },
  getRequestForBookingExpert(id, expertId, cb) {
    var {user} = this
    svc.getById(id, selectByRoleCB(this, cb, (e,r) => {
      if (!isCustomer(user,r)) return cb(Error(`Could not find request[${id}] belonging to user[${user._id}]`))
      var suggestion = _.find(r.suggested,(s) => _.idsEqual(s.expert._id,expertId) && s.expertStatus == 'available')
      if (!suggestion) return cb(Error(`No available expert[${expertId}] on request[${r._id}] not found`))
      cb(null, r)
    }))
  },
  getActiveForAdmin(cb) {
    svc.searchMany(Data.query.active, { options: { sort: { '_id': -1 }}, fields: Data.select.pipeline }, cb)
  },
  // getIncompleteForAdmin(cb) {
  //   svc.searchMany(Data.query.incomplete, { fields: Data.select.pipeline}, cb)
  // }
}

var save = {
  create(o, cb) {
    var {_id,name,email} = this.user
    o.by = { name, email, avatar: md5.gravatarUrl(email) }
    if (o.tags && o.tags.length == 1) o.tags[0].sort = 0

    o._id = svc.newId()
    o.userId = _id
    o.status = 'received'
    o.adm = { active:true }

    svc.create(o, cb)
  },
  updateByCustomer(original, update, cb) {

    // new fully completed request
    if (update.budget && !original.budget) {
      mailman.sendPipelinerNotifyRequestEmail(this.user.name, original._id, update.time.toUpperCase(),
        update.budget, update.tags, ()=>{})

      update.adm = { active:true, submitted: new Date() }
    }


    var ups = _.extend(original, update)
    if (ups.tags.length == 1) ups.tags[0].sort = 0

    // o.updated = new Date()

    svc.update(original._id, ups, cb)
  },
  updateByAdmin(original, update, cb) {
    var {adm,status} = update
    adm.lastTouch = new Date()
    if (original.adm.active && !update.adm.active)
      adm.closed = new Date()

    var ups = _.extend(original, {adm,status})
    svc.update(original._id, ups, cb)
  },
  replyByExpert(request, expert, reply, cb) {
    var {suggested} = request
    // data.events.push @newEvent "expert reviewed", eR
    reply.reply = { time: new Date() }
    var existing = _.find(suggested, (s) => _.idsEqual(s.expert._id, expert._id))
    if (!existing) suggested.push(_.extend(reply, { expert }))
    else {
      existing.expert = expert
      existing = _.extend(existing, reply)
    }

    if (reply.expertStatus == 'available' &&
      (request.status == 'received' ||
      request.status == 'waiting')) request.status = 'review'

    // sug.events.push @newEvent "expert updated"
    // sug.expert.paymentMethod = type: 'paypal', info: { email: eR.payPalEmail }

    mailman.sendPipelinerNotifyReplyEmail(this.user.name, request._id, reply.expertStatus, ()=>{})

    if (!request.adm.reviewable) request.adm.reviewable = new Date()

    // var ups = _.extend(request,{suggested})
    svc.update(request._id, request, selectByRoleCB(this,cb,cb))
  },
  addSuggestion(request, expert, body, cb)
  {
    var suggested = request.suggested
    suggested.push({
      matchedBy: { userId: this.user._id, initials: 'pg' },
      expertStatus: "waiting",
      expert
    })
    svc.update(request._id, {suggested}, cb)
  },
  removeSuggestion(request, expert, cb)
  {
    var suggested = request.suggested
    var existing = _.find(suggested, (s) => _.idsEqual(s.expert._id,expert._id) )
    suggested = _.without(suggested,existing)
    svc.update(request._id, {suggested}, cb)
  },
  deleteById(o, cb)
  {
    svc.deleteById(o._id, cb)
  }
}


module.exports = _.extend(get, save)
