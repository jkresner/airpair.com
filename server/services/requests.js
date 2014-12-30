import Svc                from '../services/_service'
import Rates              from '../services/requests.rates'
import * as Validate      from '../../shared/validation/requests.js'
import * as md5           from '../util/md5'
import Request            from '../models/request'
import User               from '../models/user'
import * as UserSvc       from '../services/users'
import * as PaymethodsSvc from '../services/paymethods'
var ExpertsSvc =          require('./experts')
var util =                require('../../shared/util')
var Data =                require('./requests.data')
var logging =             false
var svc =                 new Svc(Request, logging)
var Roles =               require('../../shared/roles.js')
var {isCustomer,isCustomerOrAdmin,isExpert} = Roles.request
var BitlySvc =            require('./wrappers/bitly')
var TwitterSvc =            require('./wrappers/twitter')

function selectByRoleCB(ctx, errorCb, cb) {
  return (e, r) => {
    if (e || !r) return errorCb(e, r)

    if (!ctx.user) return cb(null, Data.select.byView(r, 'anon'))
    else if (isCustomerOrAdmin(ctx.user, r)) {
      if (ctx.machineCall) cb(null, Data.select.byView(r, 'admin'))
      else cb(null, Data.select.byView(r, 'customer'))
    }
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

var admCB = (cb) =>
  (e,r) => {
    if (e) return cb(e)
    if (r.length) {
      for (var req of r) req = Data.select.byView(req, 'admin')
    }
    else
      r = Data.select.byView(r, 'admin')

    cb(null,r)
  }



var get = {
  getByIdForAdmin(id, cb) {
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      r = Data.select.byView(r, 'admin')
      User.findOne({_id:r.userId}, (ee,user) => {
        r.user = user
        return cb(ee,r)
      })
    })
  },
  getByIdForMatchmaker(id, cb) {
    $log('** getByIdForMatchmaker should filter a bit..')
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      r = Data.select.byView(r, 'admin')
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
    svc.searchMany({userId:this.user._id}, opts, admCB(cb))
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
    svc.searchMany(Data.query.active, { options: { sort: { '_id': -1 }}, fields: Data.select.pipeline }, admCB(cb))
  },
  getWaitingForMatchmaker(cb) {
    svc.searchMany(Data.query.waiting, { options: { sort: { 'adm.submitted': -1 }}, fields: Data.select.pipeline }, admCB(cb))
  },
  // getIncompleteForAdmin(cb) {
  //   svc.searchMany(Data.query.incomplete, { fields: Data.select.pipeline}, cb)
  // }
}

var admSet = (request, properties) =>
  (request.adm) ? _.extend(request.adm, properties) : properties


var save = {
  create(o, cb) {
    var {_id,name,email} = this.user
    o.by = { name, email, avatar: md5.gravatarUrl(email) }
    if (o.tags && o.tags.length == 1) o.tags[0].sort = 0

    o._id = svc.newId()
    o.userId = _id
    o.status = 'received'
    // o.adm = { active:true }

    analytics.track(o.by, null, 'Request', {_id:o._id,action:'start'})

    if (this.user.emailVerified) {
      // Send here's a link to update your request.
      $log('******* Should impl request started email')
    }

    svc.create(o, selectByRoleCB(this,cb,cb))
  },
  sendVerifyEmailByCustomer(original, email, cb) {
    UserSvc.updateEmailToBeVerified.call(this, email, cb, (e,r)=>{
      if (e) return cb(e)
      mailman.sendVerifyEmailForRequest(r, r.local.emailHash, original._id)
      selectByRoleCB(this,cb,cb)(null, original)
    })
  },
  updateByCustomer(original, update, cb) {
    // todo posibily revise submitted to the submit action
    var submitted = update.budget && !original.budget

    if (submitted)
    {
      mailman.sendPipelinerNotifyRequestEmail(this.user.name, original._id, update.time.toUpperCase(),
        update.budget, update.tags, ()=>{})

      update.adm = admSet(original,{active:true,submitted:new Date()})

      analytics.track(original.by, null, 'Request', {_id:original._id,action:'complete'})
    }

    var ups = _.extend(original, update)
    if (ups.tags.length == 1) ups.tags[0].sort = 0

    if (isCustomer(this.user, original)) {
      ups.lastTouch = svc.newTouch.call(this, 'updateByCustomer')
      if (this.user.emailVerified)
        ups.adm = admSet(ups,{active:true})
    }

    svc.update(original._id, ups, selectByRoleCB(this,cb,cb))
  },
  updateWithBookingByCustomer(request, order, cb) {
    request.status = 'booked'
    request.lastTouch = svc.newTouch.call(this, 'booked')
    if (!request.adm.booked)
      request.adm.booked = new Date

    svc.update(request._id, request, selectByRoleCB(this,cb,cb))
  },
  replyByExpert(request, expert, reply, cb) {
    var {suggested} = request
    // data.events.push @newEvent "expert reviewed", eR
    reply.reply = { time: new Date() }
    var existing = _.find(suggested, (s) => _.idsEqual(s.expert._id, expert._id))

    var previouslyNotAvailable = (existing)
      ? existing.expertStatus != 'available'
      : true

    if (!existing) {
      var newSuggestion = _.extend(reply, { expert })
      Rates.addSuggestedRate(request, newSuggestion)
      suggested.push(newSuggestion)
    }
    else {
      existing.expert = expert
      existing = _.extend(existing, reply)
      Rates.addSuggestedRate(request, existing)
    }

    if (reply.expertStatus == 'available' &&
      (request.status == 'received' ||
      request.status == 'waiting')) request.status = 'review'

    if (previouslyNotAvailable && reply.expertStatus == 'available') {
      PaymethodsSvc.hasPaymethods(request.userId,(e,hasPaymethods)=>{
        mailman.sendExpertAvailable(request.by, expert.name, request._id, !hasPaymethods, ()=>{})
      })
    }

    // sug.events.push @newEvent "expert updated"
    // sug.expert.paymentMethod = type: 'paypal', info: { email: eR.payPalEmail }

    mailman.sendPipelinerNotifyReplyEmail(this.user.name, reply.expertStatus, request._id,
        request.by.name, ()=>{})

    request.lastTouch = svc.newTouch.call(this, `replyByExpert:${reply.expertStatus}`)
    if (!request.adm.reviewable)
      request.adm = admSet(request,{reviewable:new Date()})

    // var ups = _.extend(request,{suggested})
    svc.update(request._id, request, selectByRoleCB(this,cb,cb))
  },
  deleteById(o, cb)
  {
    svc.deleteById(o._id, cb)
  }
}

var admin = {
  updateByAdmin(original, update, cb) {
    var action = 'update'
    var {adm,status} = update
    if (original.adm.active && !update.adm.active) {
      action = `closed:${update.status}`
      adm.closed = new Date()
    }
    else if (original.status == "received" && update.status == "waiting") {
      action = `received`
      adm.received = new Date()
    }

    //-- Reopen a closed request for various possible reasons
    if (!original.adm.active && update.status == "review") {
      update.adm.active = true
    }

    adm.lastTouch = svc.newTouch.call(this, action)

    var ups = _.extend(original, {adm,status})
    svc.update(original._id, ups, admCB(cb))
  },
  farmByAdmin(request, tweet, cb) {
    //TODO Mote url genertion to analyticsSvc ?
    var campPeriod = new moment().format("MMMYY").toLowerCase()
    var term = encodeURIComponent(util.tagsString(request.tags))
    var url = `/review/${request._id}?utm_medium=farm-link&utm_campaign=farm-${campPeriod}&utm_term=${term}`

    var {adm} = request
    BitlySvc.shorten(url, (e,shortLink) => {
      adm.farmed = new Date
      adm.lastTouch = svc.newTouch.call(this, 'farm')
      TwitterSvc.postTweet(`${tweet} ${shortLink}`, (e,r) => {
        if (e) return cb(e)
        svc.update(request._id, _.extend(request, {adm}), admCB(cb))
      })
    })
  },
  sendMessageByAdmin(request, message, cb)
  {
    var {status,adm} = request
    var messages = request.messages || []

    if (message.type == 'received') {
      status = 'waiting'
      adm.owner = this.user.email.substring(0,2)
      adm.received = new Date
    }

    mailman.sendRawTextEmail(request.by, message.subject, message.body, ()=>{})

    adm.lastTouch = svc.newTouch.call(this, `sent:${message.type}`)
    messages.push(_.extend(message,{fromId:this.user._id,toId:request.userId}))

    svc.update(request._id, _.extend(request, {status,adm,messages}), admCB(cb))
  },
  addSuggestion(request, expert, body, cb)
  {
    var {adm,suggested} = request
    suggested.push({
      matchedBy: { userId: this.user._id, initials: 'pg' },
      expertStatus: "waiting",
      expert
    })

    mailman.sendExpertSuggestedEmail(expert, request.by.name, request._id,
      this.user.name, request.tags, ()=>{})

    adm.lastTouch = svc.newTouch.call(this, `suggest:${expert.name}`)
    svc.update(request._id, _.extend(request, {suggested,adm}), admCB(cb))
  },
  removeSuggestion(request, expert, cb)
  {
    var {adm,suggested} = request
    var existing = _.find(suggested, (s) => _.idsEqual(s.expert._id,expert._id) )
    suggested = _.without(suggested,existing)

    adm.lastTouch = svc.newTouch.call(this, `remove:${expert.name}`)
    svc.update(request._id, _.extend(request, {suggested,adm}), admCB(cb))
  }
}


module.exports = _.extend(get, _.extend(save,admin))
