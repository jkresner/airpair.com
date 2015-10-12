var logging               = false
var md5                   = require('../util/md5')
var Rates                 = require('./requests.rates')
var {Request,Order,Booking}       = DAL
var Roles                 = require('../../shared/roles.js')
var UserSvc               = require('../services/users')
var PaymethodsSvc         = require('../services/paymethods')
var MojoSvc               = require('../services/mojo')
var {select,query}        = require('./requests.data')
var User                  = require('../models/user')
var selectCB              = select.cb
var {isCustomer,isCustomerOrAdmin,isExpert} = Roles.request

var svc = {
  newTouch(action) {
    return {
      action,
      utc: new Date(),
      by: { _id: this.user._id, name: this.user.name }
    }
  }
}

var get = {

  getByIdForAdmin(id, cb) {
    Request.getById(id, (e,r) => {
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
            Order.getManyByQuery({userId:r.userId}, selectOrdersFields, (eeer,orders) => {
              r.orders = orders
              r.bookings = []
              if (orders.length == 0) return cb(eeer,r)
              Booking.getManyByQuery({customerId:r.userId},{ sort: {'_id':-1 }},(eerr,bookings) => {
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
    Request.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      r = select.byView(r, 'admin')
      User.findOne({_id:r.userId}, (ee,user) => {
        r.user = user
        var exclude = _.map(r.suggested||[],(s)=>s.expert._id.toString())
        MojoSvc.getGroupMatch(r.tags, {take:5,exclude,maxRate:r.budget},(ee,group)=>{
          // $log('getByIdForMatchmaker', r.tags, ee, group)
          r.groupMatch = group
          return cb(ee,r)
        })
      })
    })
  },

  getByIdForUser(id, cb) {  // for updating
    Request.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      if (!isCustomerOrAdmin(this.user,r)) return cb(Error(`Could not find request[${id}] belonging to user[${this.user._id}]`))
      cb (null, select.byView(r, 'customer'))
    })
  },

  getByIdForReview(id, cb) {
    Request.getById(id, selectCB.byRole(this,cb,cb))
  },

  getByIdForBookingInflate(id, cb)
  {
    var fields = !Roles.isAdmin(this.user) ? select.anon :
       _.extend({'suggested._id': 1,'suggested.expert.name': 1,'brief':1},select.pipeline)

    Request.getById(id, {select:fields}, cb)
  },

  getByUserIdForAdmin(userId, cb) {
    Request.getManyByQuery({userId}, { sort: { '_id': -1 } }, cb)
  },

  getMy(cb) {
    var opts = { sort: { '_id': -1 }, select: select.customer }
    Request.getManyByQuery({userId:this.user._id}, opts, selectCB.adm(cb))
  },

  getRequestForBookingExpert(id, expertId, cb) {
    var {user} = this
    Request.getById(id, selectCB.byRole(this, cb, (e,r) => {
      if (isExpert(user,r)) return cb(Error(`Cannot book yourself on request[${id}]`))
      if (!isCustomerOrAdmin(user,r)) return cb(Error(`Could not find request[${id}] belonging to user[${user._id}]`))
      var suggestion = _.find(r.suggested,(s) => _.idsEqual(s.expert._id,expertId) && s.expertStatus == 'available')
      if (!suggestion) return cb(Error(`No available expert[${expertId}] on request[${r._id}] for booking`))
      cb(null, r)
    }))
  },

  getActiveForAdmin(cb) {
    Request.getManyByQuery(query.active, { sort: { '_id': -1 }, select: select.pipeline }, selectCB.adm(cb))
  },

  get2015ForAdmin(cb) {
    Request.getManyByQuery(query['2015'], { sort: { '_id': -1 }, select: select.pipeline }, selectCB.adm(cb))
  },

  getWaitingForMatchmaker(cb) {
    Request.getManyByQuery(query.waiting, { sort: { 'adm.submitted': -1 }, select: select.pipeline }, selectCB.adm(cb))
  },

  getExperts(expert, cb) {
    this.expertId = expert._id
    Request.getManyByQuery(query.experts(expert), { select: select.experts }, selectCB.experts(this, cb))
  },
}

var admSet = (request, properties) =>
  (request.adm) ? _.extend(request.adm, properties) : properties


var save = {
  create(o, cb) {
    var {_id,name,email} = this.user
    o.by = { name, email, avatar: md5.gravatarUrl(email) }
    if (o.tags && o.tags.length == 1) o.tags[0].sort = 0

    o._id = Request.newId()
    o.userId = _id
    o.status = 'received'
    // o.adm = { active:true }

    analytics.track(o.by, null, 'Request', {_id:o._id,action:'start'})

    if (this.user.emailVerified) {
      // Send here's a link to update your request.
      $log('******* Should impl request started email')
    }

    Request.create(o, selectCB.byRole(this,cb,cb))
  },
  sendVerifyEmailByCustomer(original, email, cb) {
    UserSvc.updateEmailToBeVerified.call(this, email, cb, (e,r, hash)=>{
      if (e) return cb(e)
      mailman.sendTemplate('user-verify-email',{hash}, r)
      selectCB.byRole(this,cb,cb)(null, original)
    })
  },
  updateByCustomer(original, update, cb) {
    var {adm,lastTouch} = original
    var {tags,type,experience,brief,hours,time,budget,title} = update
    // $log('updateByCustomer'.cyan, update)

    // todo posibily revise submitted to the submit action
    var submitted = title && !original.title
    if (submitted)
    {
      var d = {byName:this.user.name, _id:original._id,budget:update.budget,
        tags:util.tagsString(update.tags),time:update.time.toUpperCase()}
      mailman.sendTemplate('pipeliner-notify-request', d, 'pipeliners')

      adm = admSet(original,{active:true,submitted:new Date()})

      analytics.track(original.by, null, 'Request', {_id:original._id,action:'submit'})
    }

    // var ups = _.extend(original, update)
    if (tags.length == 1) tags[0].sort = 0

    if (isCustomer(this.user, original)) {
      lastTouch = svc.newTouch.call(this, 'updateByCustomer')
      if (this.user.emailVerified)
        adm = admSet(original,{active:true})
    }

    Request.updateSet(original._id,
      {tags,type,experience,brief,hours,time,budget,title,adm,lastTouch}
      , selectCB.byRole(this,cb,cb))
  },
  updateWithBookingByCustomer(request, order, cb) {
    var {adm} = request
    var status = 'booked'
    var lastTouch = svc.newTouch.call(this, 'booked')
    if (!adm.booked) adm.booked = new Date

    Request.updateSet(request._id, {adm,status,lastTouch}, selectCB.byRole(this,cb,cb))
  },

  replyByExpert(request, expert, reply, cb)
  {
    var {suggested,adm,lastTouch,status,_id} = request
    var replyStatus = reply.expertStatus.toUpperCase()

    reply.reply = { time: new Date() }
    // data.events.push @newEvent "expert reviewed", eR
    var existing = _.find(suggested, (s) => _.idsEqual(s.expert._id, expert._id))

    var previouslyNotAvailable = !existing || existing.expertStatus != 'available'

    if (!existing) {
      var newSuggestion = _.extend(select.expertToSuggestion(expert, this.user), reply)
      newSuggestion._id =  Request.newId()
      Rates.addSuggestedRate(request, newSuggestion)
      newSuggestion.matchedBy = { _id: Request.newId(),
        type: 'self', userId: this.user._id, initials: expert.initials }
      suggested.push(newSuggestion)
    }
    else {
      existing.expert = select.expertToSuggestion(expert, this.user).expert
      existing = _.extend(existing, reply)
      Rates.addSuggestedRate(request, existing)
    }

    var d = {_id,isAvailable:replyStatus=="AVAILABLE", expertName: expert.name}

    if (d.isAvailable && (status == 'received' || status == 'waiting'))
      status = 'review'

    if (previouslyNotAvailable && d.isAvailable)
      PaymethodsSvc.hasPaymethods(request.userId, (e,hasPaymethods) =>
        mailman.sendTemplate('expert-available',
          _.extend({noPaymethods: !hasPaymethods },d), request.by))

    // sug.events.push @newEvent "expert updated"
    // sug.expert.paymentMethod = type: 'paypal', info: { email: eR.payPalEmail }

    var dRep = { status: replyStatus, byName:this.user.name, requestByName:request.by.name }
    mailman.sendTemplate('pipeliner-notify-reply', _.extend(dRep,d), 'pipeliners')

    lastTouch = svc.newTouch.call(this, `replyByExpert:${reply.expertStatus}`)
    if (!adm.reviewable && reply.expertStatus == 'available')
      adm = admSet(request,{reviewable:new Date()})

    Request.updateSet(request._id, {suggested,adm,lastTouch,status}, selectCB.byRole(this,cb,cb))
  },
  deleteById(o, cb)
  {
    Request.delete(o, cb)
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
    Request.updateSet(original._id, ups, selectCB.adm(cb))
  },


  farmByAdmin(request, tweet, cb) {
    var campPeriod = new moment().format("MMMYY").toLowerCase()
    var term = encodeURIComponent(util.tagsString(request.tags))
    var url = `/review/${request._id}?utm_medium=farm-link&utm_campaign=farm-${campPeriod}&utm_term=${term}`

    var {adm} = request
    Wrappers.Bitly.shorten(url, (e,shortLink) => {
      adm.farmed = new Date
      adm.lastTouch = svc.newTouch.call(this, 'farm')
      Wrappers.Twitter.postTweet(`${tweet} ${shortLink}`, (e,r) => {
        if (e) return cb(e)
        Request.updateSet(request._id, {adm}, selectCB.adm(cb))
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

    mailman.sendMarkdown(message.subject, message.markdown, request.by, 'team')

    adm.lastTouch = svc.newTouch.call(this, `sent:${message.type}`)
    messages.push(_.extend(message,{_id:Request.newId(),fromId:this.user._id,toId:request.userId,
      body: message.text||message.markdown}))

    Request.updateSet(request._id, {status,adm,messages}, selectCB.adm(cb))
  },


  addSuggestion(request, expert, msg, cb)
  {
    var {adm,suggested} = request
    adm.lastTouch = svc.newTouch.call(this, `suggest:${expert.name}`)
    suggested.push(select.expertToSuggestion(expert, this.user))
    Request.updateSet(request._id, {suggested,adm}, selectCB.adm(cb))
    mailman.sendMarkdown(msg.subject, msg.markdown, expert, 'team')
  },


  groupSuggest(request, tag, cb)
  {
    var {adm,suggested,budget} = request
    adm.lastTouch = svc.newTouch.call(this, `suggestGroup:${tag.slug}`)

    var exclude = _.map(request.suggested||[],(s)=>s.expert._id.toString())
    MojoSvc.getGroupMatch([tag], {take:5,exclude,maxRate:budget}, (e,group) => {
      for (var expert of group.suggested)
        suggested.push(select.expertToSuggestion(expert, this.user, group.type))

      Request.updateSet(request._id, {suggested,adm}, selectCB.adm(cb))
      var tmplData = select.template.expertAutomatch(request, tag.name)
      mailman.sendTemplateMails('expert-automatch', tmplData, group.suggested)
    })
  },


  removeSuggestion(request, expert, cb)
  {
    var {adm,suggested} = request
    var existing = _.find(suggested, (s) => _.idsEqual(s.expert._id,expert._id) )
    suggested = _.without(suggested,existing)

    adm.lastTouch = svc.newTouch.call(this, `remove:${expert.name}`)
    Request.updateSet(request._id, _.extend(request, {suggested,adm}), selectCB.adm(cb))
  }
}


module.exports = _.extend(get, _.extend(save,admin))
