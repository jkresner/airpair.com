var logging                  = false
var md5                      = require('../util/md5')
var Rates                    = require('./requests.rates')
var {Request,Order,
  Booking,User}              = DAL
var Roles                    = require('../../shared/roles.js')
var PaymethodsSvc            = require('../services/paymethods')
var MojoSvc                  = require('../services/mojo')
var {select,query}           = require('./requests.data')
var {isCustomer,isCustomerOrAdmin,isExpert} = Roles.request


var get = {

  getByIdForAdmin(id, cb) {
    Request.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      r = select.byView(r, 'admin')
      User.getById(r.userId, (ee,user) => {
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
      User.getById(r.userId, (ee,user) => {
        r.user = user
        var exclude = _.map(r.suggested||[],(s)=>s.expert._id.toString())
        MojoSvc.getGroupMatch(r.tags, {take:10,exclude,maxRate:r.budget},(ee,group)=>{
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
    Request.getById(id, {join: {'suggested.expert.userId':'auth'}}, select.cb.byRole(this,cb,cb))
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
    Request.getManyByQuery({userId:this.user._id}, opts, select.cb.adm(cb))
  },

  getRequestForBookingExpert(id, expert, cb) {
    var {user} = this
    Request.getById(id, //select.cb.byRole(this, cb,
      (e,r) => {
      if (isExpert(user,r)) return cb(Error(`Cannot book yourself on request[${id}]`))
      if (!isCustomerOrAdmin(user,r)) return cb(Error(`Could not find request[${id}] belonging to user[${user._id}]`))
      var suggestion = _.find(r.suggested,(s) => _.idsEqual(s.expert._id,expert._id) && s.expertStatus == 'available')
      if (!suggestion) return cb(Error(`No available expert[${expert._id}] on request[${r._id}] for booking`))
      Object.assign(suggestion.expert, _.pick(expert,'name','username','initials','avatar','location','timezone'))
      cb(null, r)
    })
    // )
  },

  getActiveForAdmin(cb) {
    Request.getManyByQuery(query.active, { sort: { '_id': -1 }, select: select.pipeline }, select.cb.adm(cb))
  },

  get2015ForAdmin(cb) {
    Request.getManyByQuery(query['2015'], { sort: { '_id': -1 }, select: select.pipeline }, select.cb.adm(cb))
  },

  getWaitingForMatchmaker(cb) {
    Request.getManyByQuery(query.waiting, { sort: { 'adm.submitted': -1 }, select: select.pipeline }, select.cb.adm(cb))
  },

  // getExperts(expert, cb) {
  //   this.expertId = expert._id
  //   Request.getManyByQuery(query.experts(expert), { select: select.experts }, select.cb.experts(this, cb))
  // },

  getAllowed(cb) {
    Order.getManyByQuery({userId:this.user._id}, (e,r) => {
      var total = 0
      for (var order of r) total+=order.total
      if (total < 500) cb(null, {require:'spend'})
      else if (!this.user.location) cb(null, {require:'location'})
      else cb(null,{welcome:this.user._id})
    })
  }
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
    // o.lastTouch = svc.newTouch.call(this, 'create')
    // o.adm = { active:true }

    // analytics.echo(o.by, null, 'Request', {_id:o._id,action:'start'})

    if (this.user.emailVerified) {
      // Send here's a link to update your request.
      // $log('******* Should impl request started email')
    }

    Request.create(o, select.cb.byRole(this,cb,cb))
  },
  // sendVerifyEmailByCustomer(original, email, cb) {
    // cb(V2DeprecatedError('Request.sendVerifyEmailByCustomer'))
    // UserSvc.updateEmailToBeVerified.call(this, email, cb, (e,r, hash)=>{
    //   if (e) return cb(e)
    //   mailman.sendTemplate('user-verify-email',{hash}, r)
    //   select.cb.byRole(this,cb,cb)(null, original)
    // })
  // },
  updateByCustomer(original, update, cb) {
    // $log('updateByCustomer'.cyan, update)

    // todo posibily revise submitted to the submit action
    var submitted = update.title && !original.title
    if (submitted)
    {
      var d = {byName:this.user.name, _id:original._id,budget:update.budget,
        tags:util.tagsString(update.tags),time:update.time.toUpperCase()}
      mailman.sendTemplate('pipeliner-notify-request', d, 'pipeliners')

      original.adm = admSet(original,{active:true,submitted:new Date()})
      // analytics.echo(original.by, null, 'Request', {_id:original._id,action:'submit'})
    }

    // var ups = _.extend(original, update)
    if (update.tags.length == 1) update.tags[0].sort = 0

    if (isCustomer(this.user, original)) {
      update.lastTouch = svc.newTouch.call(this, 'updateByCustomer')
      // if (this.user.emailVerified)
      update.adm = admSet(original,{active:true})
    }

    Request.updateSet(original._id, update, select.cb.byRole(this,cb,cb))
  },
  updateWithBookingByCustomer(request, order, cb) {
    var {adm} = request
    var status = 'booked'
    var lastTouch = svc.newTouch.call(this, 'booked')
    if (!adm.booked) adm.booked = new Date

    Request.updateSet(request._id, {adm,status,lastTouch}, select.cb.byRole(this,cb,cb))
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
    Request.updateSet(original._id, ups, select.cb.adm(cb))
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
        Request.updateSet(request._id, {adm}, select.cb.adm(cb))
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

    Request.updateSet(request._id, {status,adm,messages}, select.cb.adm(cb))
  },


  addSuggestion(request, expert, msg, cb)
  {
    var {adm,suggested} = request
    adm.lastTouch = svc.newTouch.call(this, `suggest:${expert.name}`)
    var suggest = select.expertToSuggestion(expert, this.user)
    suggest._id = Request.newId()
    suggested.push(suggest)
    Request.updateSet(request._id, {suggested,adm}, select.cb.adm(cb))
    mailman.sendMarkdown(msg.subject, msg.markdown, expert, 'team')
  },


  // groupSuggest(request, tag, cb)
  // {
  //   var {adm,suggested,budget} = request
  //   adm.lastTouch = svc.newTouch.call(this, `suggestGroup:${tag.slug}`)

  //   var exclude = _.map(request.suggested||[],(s)=>s.expert._id.toString())
  //   MojoSvc.getGroupMatch([tag], {take:5,exclude,maxRate:budget}, (e,group) => {
  //     for (var expert of group.suggested) {
  //       var suggest = select.expertToSuggestion(expert, this.user, group.type)
  //       // suggest._id = Request.newId()
  //       suggested.push(suggest)
  //     }

  //     Request.updateSet(request._id, {suggested,adm}, select.cb.adm(cb))
  //     var tmplData = select.template.expertAutomatch(request, tag.name)
  //     mailman.sendTemplateMails('expert-automatch', tmplData, group.suggested)
  //   })
  // },


  removeSuggestion(request, expert, cb)
  {
    var {adm,suggested} = request
    var existing = _.find(suggested, (s) => _.idsEqual(s.expert._id,expert._id) )
    suggested = _.without(suggested,existing)

    adm.lastTouch = svc.newTouch.call(this, `remove:${expert.name}`)
    Request.updateSet(request._id, {suggested,adm}, select.cb.adm(cb))
  }
}


module.exports = _.extend(get, _.extend(save,admin))
