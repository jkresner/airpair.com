import Svc                from '../services/_service'
import Rates              from '../services/requests.rates'
import * as ExpertsSvc    from './experts'
import * as md5           from '../util/md5'
import * as Validate      from '../../shared/validation/requests.js'
import Request            from '../models/request'
var util =                require('../../shared/util')
var Data =                require('./requests.data')
var logging =             false
var svc =                 new Svc(Request, logging)
var {isCustomer,isExpert} = require('../../shared/roles.js').request


function selectByRoleCB(ctx, cb) {
  return (e, r) => {
    if (e || !r) return cb(e, r)

    if (!ctx.user) return cb(null, util.selectFromObject(r, Data.select.anon))
    else if (isCustomer(ctx.user, r)) {
      var request = util.selectFromObject(r, Data.select.customer)
      Rates.addRequestSuggestedRates(request, true)
      cb(null, request)
    } else {
      Rates.addRequestSuggestedRates(r, false)
      var request = util.selectFromObject(r, Data.select.review)
      request.suggested = Data.select.meSuggested(r, ctx.user._id)
      if (request.suggested.length == 1) {
        return cb(null, request)
      }

      ExpertsSvc.getMe.call(ctx, (ee,expert) => {
        if (expert && expert.rate) {
          request.budget = r.budget
          request.suggested.push({expert})
          Rates.addRequestSuggestedRates(request, false)
          delete request.budget
        }
        cb(null, request)
      })
    }
  }
}

var get = {
  getByIdForAdmin(id, cb) {
    svc.getById(id, cb)
  },
  getByIdForUser(id, cb) {  // for updating
    var userId = this.user._id
    svc.getById(id, (e,r) => {
      if (e || !r) return cb(e,r)
      if (!_.idsEqual(userId,r.userId)) return cb(Error(`Could not find request[${id}] belonging to user[${userId}]`))
      cb (null, util.selectFromObject(r, Data.select.customer))
    })
  },
  getByIdForReview(id, cb) {
    svc.getById(id, selectByRoleCB(this,cb))
  },
  getUsers(userId, cb) {
    var opts = { options: { sort: { '_id': -1 } } }
    svc.searchMany({userId}, opts, cb)
  },
  getMy(cb) {
    getByUserId(this.user._id, cb)
  },
  getRequestForBookingExpert(id, expertId, cb) {
    var {user} = this
    svc.getById(id, selectByRoleCB(this,(e,r) => {
      if (!isCustomer(user,r)) return cb(Error(`Could not find request[${id}] belonging to user[${user._id}]`))
      var suggestion = _.find(r.suggested,(s) => _.idsEqual(s.expert._id,expertId) && s.expertStatus == 'available')
      if (!suggestion) return cb(Error(`No available expert[${expertId}] on request[${r._id}] not found`))
      cb(null, r)
    }))
  }
}

var save = {
  create(o, cb) {
    var {_id,name,email} = this.user
    o.by = { name, email, avatar: md5.gravatarUrl(email) }
    if (o.tags && o.tags.length == 1) o.tags[0].sort = 0

    o._id = svc.newId()
    o.userId = _id
    o.status = 'received'

    mailman.sendPipelinerNotifyRequestEmail(this.user.name, o._id, ()=>{})

    svc.create(o, cb)
  },
  updateByCustomer(original, update, cb) {
    var ups = _.extend(original, update)
    if (ups.tags.length == 1) ups.tags[0].sort = 0

    // o.updated = new Date()

    svc.update(original._id, ups, cb)
  },
  replyByExpert(request, expert, reply, cb) {
    var {suggested} = request
    // data.events.push @newEvent "expert reviewed", eR
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

    // var ups = _.extend(request,{suggested})
    svc.update(request._id, request, selectByRoleCB(this,cb))
  }
}


module.exports = _.extend(get, save)
