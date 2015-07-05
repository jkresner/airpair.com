var logging               = false
import * as md5           from '../util/md5'
import Svc                from '../services/_service'
import Rates              from '../services/requests.rates'
import Request            from '../models/request'
import Booking            from '../models/booking'
import Order              from '../models/order'
import User               from '../models/user'
var Roles                 = require('../../shared/roles.js')
var UserSvc               = require('../services/users')
var PaymethodsSvc         = require('../services/paymethods')
var {select,query}        = require('./requests.data')
var selectCB              = select.cb
var svc                   = new Svc(Request, logging)
var {isCustomer,isCustomerOrAdmin,isExpert} = Roles.request

var get = {

  getByIdForAdmin(id, cb) {
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      r = select.byView(r, 'admin')
      User.findOne({_id:r.userId}).lean().exec((ee,user) => {
        if (ee || !user) return cb(ee,r)
        Wrappers.Slack.checkUser({email:user.email,name:user.name}, (er,slack)=>{
          r.user = _.extend({chat:{slack}},user)
          get.getByUserIdForAdmin(user._id, (eee,requests) => {
            var thisR = _.find(requests,(rr)=>_.idsEqual(rr._id,id))
            r.prevs = _.without(requests,thisR)
            var selectOrdersFields = require('./orders.data').select.listAdmin
            //-- using models instead of services to avoid circular dependencies
            Order.find({userId:r.userId}, selectOrdersFields,(eeer,orders) => {
              r.orders = orders
              r.bookings = []
              if (orders.length == 0) return cb(eeer,r)
              Booking.find({customerId:r.userId},{},{ sort: { '_id': -1 } },(eerr,bookings) => {
                r.bookings = bookings
                cb(eerr,r)
              })
            })
          })
        })
      })
    })
  },

  getByIdForMatchmaker(id, cb) {
    // $log('** getByIdForMatchmaker should filter properties a bit when non-admins start matching..')
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      r = select.byView(r, 'admin')
      User.findOne({_id:r.userId}, (ee,user) => {
        r.user = user
        return cb(ee,r)
      })
    })
  },

  getByIdForUser(id, cb) {  // for updating
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      if (!isCustomerOrAdmin(this.user,r)) return cb(Error(`Could not find request[${id}] belonging to user[${this.user._id}]`))
      cb (null, select.byView(r, 'customer'))
    })
  },

  getByIdForReview(id, cb) {
    svc.getById(id, selectCB.byRole(this,cb,cb))
  },

  getByUserIdForAdmin(userId, cb) {
    var opts = { options: { sort: { '_id': -1 } } }
    svc.searchMany({userId}, opts, cb)
  },

  getMy(cb) {
    var opts = { options: { sort: { '_id': -1 } }, fields: select.customer }
    svc.searchMany({userId:this.user._id}, opts, selectCB.adm(cb))
  },

  getRequestForBookingExpert(id, expertId, cb) {
    var {user} = this
    svc.getById(id, selectCB.byRole(this, cb, (e,r) => {
      if (!isCustomerOrAdmin(user,r)) return cb(Error(`Could not find request[${id}] belonging to user[${user._id}]`))
      var suggestion = _.find(r.suggested,(s) => _.idsEqual(s.expert._id,expertId) && s.expertStatus == 'available')
      if (!suggestion) return cb(Error(`No available expert[${expertId}] on request[${r._id}] for booking`))
      cb(null, r)
    }))
  },

  getActiveForAdmin(cb) {
    svc.searchMany(query.active, { options: { sort: { '_id': -1 }}, fields: select.pipeline }, selectCB.adm(cb))
  },

  get2015ForAdmin(cb) {
    svc.searchMany(query['2015'], { options: { sort: { '_id': -1 }}, fields: select.pipeline }, selectCB.adm(cb))
  },

  getWaitingForMatchmaker(cb) {
    svc.searchMany(query.waiting, { options: { sort: { 'adm.submitted': -1 }}, fields: select.pipeline }, selectCB.adm(cb))
  },

  // getIncompleteForAdmin(cb) {
  //   svc.searchMany(query.incomplete, { fields: select.pipeline}, cb)
  // }

  getExperts(expert, cb) {
    var opts = { fields: select.experts }
    this.expertId = expert._id
    svc.searchMany(query.experts(expert), opts, selectCB.experts(this, cb))
  },
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

    svc.create(o, selectCB.byRole(this,cb,cb))
  },
  sendVerifyEmailByCustomer(original, email, cb) {
    UserSvc.updateEmailToBeVerified.call(this, email, cb, (e,r, hash)=>{
      if (e) return cb(e)
      mailman.sendVerifyEmailForRequest(r, hash, original._id)
      selectCB.byRole(this,cb,cb)(null, original)
    })
  },
  updateByCustomer(original, update, cb) {
    // todo posibily revise submitted to the submit action
    var submitted = update.title && !original.title

    if (submitted)
    {
      var d = {byName:this.user.name, _id:original._id,budget:update.budget,
        tags:util.tagsString(update.tags),time:update.time.toUpperCase()}
      mailman.send('pipeliners','pipeliner-notify-request', d, ()=>{})

      update.adm = admSet(original,{active:true,submitted:new Date()})

      analytics.track(original.by, null, 'Request', {_id:original._id,action:'submit'})
    }

    var ups = _.extend(original, update)
    if (ups.tags.length == 1) ups.tags[0].sort = 0

    if (isCustomer(this.user, original)) {
      ups.lastTouch = svc.newTouch.call(this, 'updateByCustomer')
      if (this.user.emailVerified)
        ups.adm = admSet(ups,{active:true})
    }

    if (ups.user) delete ups.user //got lazy should solve this via proper pattern

    svc.update(original._id, ups, selectCB.byRole(this,cb,cb))
  },
  updateWithBookingByCustomer(request, order, cb) {
    request.status = 'booked'
    request.lastTouch = svc.newTouch.call(this, 'booked')
    if (!request.adm.booked)
      request.adm.booked = new Date

    svc.update(request._id, request, selectCB.byRole(this,cb,cb))
  },

  replyByExpert(request, expert, reply, cb)
  {
    var {suggested,adm,lastTouch,status} = request

    expert = select.expertToSuggestion(expert)
    // data.events.push @newEvent "expert reviewed", eR
    reply.reply = { time: new Date() }
    var existing = _.find(suggested, (s) => _.idsEqual(s.expert._id, expert._id))

    var previouslyNotAvailable = !existing || existing.expertStatus != 'available'

    if (!existing) {
      var newSuggestion = _.extend(reply, { expert })
      Rates.addSuggestedRate(request, newSuggestion)
      newSuggestion.matchedBy = { _id: svc.newId(),
        type: 'self', userId: this.user._id, initials: expert.initials }
      suggested.push(newSuggestion)
    }
    else {
      existing.expert = expert
      existing = _.extend(existing, reply)
      Rates.addSuggestedRate(request, existing)
    }

    if (reply.expertStatus == 'available' &&
        (status == 'received' || status == 'waiting')) status = 'review'

    if (previouslyNotAvailable && reply.expertStatus == 'available')
      PaymethodsSvc.hasPaymethods(request.userId, (e,hasPaymethods) =>
        mailman.sendExpertAvailable(request.by, expert.name, request._id, !hasPaymethods, ()=>{}))

    // sug.events.push @newEvent "expert updated"
    // sug.expert.paymentMethod = type: 'paypal', info: { email: eR.payPalEmail }

    var d = { isAvailable:reply.expertStatus=="available",status:reply.expertStatus.toUpperCase(),
      byName:this.user.name,_id:request._id,requestByName:request.by.name }
    mailman.send('pipeliners', 'pipeliner-notify-reply', d, ()=>{})

    lastTouch = svc.newTouch.call(this, `replyByExpert:${reply.expertStatus}`)
    if (!adm.reviewable && reply.expertStatus == 'available')
      adm = admSet(request,{reviewable:new Date()})

    svc.updateWithSet(request._id, {suggested,adm,lastTouch,status}, selectCB.byRole(this,cb,cb))
  },
  deleteById(o, cb)
  {
    svc.deleteById(o._id, cb)
  }
}


var admin = {

  updateByAdmin(original, update, cb) {
    var action = 'updateByAdmin'
    var {adm,status} = update
    if (original.adm.active &&
      (status == 'canceled' || status == 'complete' || status == 'junk')
    ) {
      delete adm.active
      action = `closed:${status}`
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
    if (ups.user) {
      $log('updateByAdmin: should not be saving user to request')
      delete ups.user
    }
    svc.update(original._id, ups, selectCB.adm(cb))
  },

  farmByAdmin(request, tweet, cb) {
    //TODO Mote url genertion to analyticsSvc ?
    var campPeriod = new moment().format("MMMYY").toLowerCase()
    var term = encodeURIComponent(util.tagsString(request.tags))
    var url = `/review/${request._id}?utm_medium=farm-link&utm_campaign=farm-${campPeriod}&utm_term=${term}`

    var {adm} = request
    Wrappers.Bitly.shorten(url, (e,shortLink) => {
      adm.farmed = new Date
      adm.lastTouch = svc.newTouch.call(this, 'farm')
      Wrappers.Twitter.postTweet(`${tweet} ${shortLink}`, (e,r) => {
        if (e) return cb(e)
        svc.update(request._id, _.extend(request, {adm}), selectCB.adm(cb))
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
    messages.push(_.extend(message,{_id:svc.newId(),fromId:this.user._id,toId:request.userId}))

    svc.update(request._id, _.extend(request, {status,adm,messages}), selectCB.adm(cb))
  },

  addSuggestion(request, expert, msg, cb)
  {
    var {adm,suggested} = request
    var initials = this.user.email.replace("@airpair.com", "")
    expert = select.expertToSuggestion(expert)
    suggested.push({
      matchedBy: { _id: svc.newId(), type: 'staff', userId: this.user._id, initials },
      expertStatus: "waiting",
      expert
    })

    mailman.sendRawTextEmail(expert, msg.subject, msg.body, ()=>{})

    adm.lastTouch = svc.newTouch.call(this, `suggest:${expert.name}`)
    svc.update(request._id, _.extend(request, {suggested,adm}), selectCB.adm(cb))
  },

  removeSuggestion(request, expert, cb)
  {
    var {adm,suggested} = request
    var existing = _.find(suggested, (s) => _.idsEqual(s.expert._id,expert._id) )
    suggested = _.without(suggested,existing)

    adm.lastTouch = svc.newTouch.call(this, `remove:${expert.name}`)
    svc.update(request._id, _.extend(request, {suggested,adm}), selectCB.adm(cb))
  }
}


module.exports = _.extend(get, _.extend(save,admin))
