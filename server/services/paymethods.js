import Svc from './_service'
import * as Validate from '../../shared/validation/billing.js'
import PayMethod from '../models/paymethod'
import * as UserSvc from './users'
import * as Braintree from './wrappers/braintree'
var Stripe = require('./wrappers/stripe')
var Settings = require('../models/v0').Settings


var logging = false
var svc = new Svc(PayMethod, logging)


export function getById(id, cb) {
  var userId = this.user._id
  svc.getById(id, (e, r) => {
    if (r)
    {
      var validPaymethodForUser = r.userId == userId  // TODO check company cards
      if (validPaymethodForUser) return cb(null, r)
    }

    cb(e,null)
  })
}

export function charge(amount, orderId, payMethod, cb) {
  if (payMethod.type == 'braintree')
    Braintree.chargeWithMethod(amount, orderId, payMethod.info.token, cb)
  else if (payMethod.type == 'stripe')
    Stripe.createCharge(amount, orderId, payMethod.info.id, cb)
  else
    return cb(`${payMethod.type} not supported a payment type`)
}

export function addPaymethod(o, cb) {
  var user = this.user
  var customerId = (o.companyId != null) ? o.companyId : user._id

  var savePayMethod = (ee, payMethodInfo) => {
    if (ee) return cb(ee)
    else {
      o.userId = user._id
      o.companyId = o.companyId
      o.info = payMethodInfo
      if (logging) $log('savePayMethod', payMethodInfo)

      svc.create(o, (e,r) => {
        if (logging) $log('savePayMethod', o.makeDefault, user._id, o)
        analytics.identify(user, {}, 'Save PayMethod', { type: o.type })
        if (o.makeDefault) UserSvc.update.call(this, user._id, { primaryPayMethodId: r._id })
        cb(e, r)
      })
    }
  }

  if (o.type == 'braintree')
    Braintree.addPaymentMethod(customerId, user, null, o.token, savePayMethod)
  else if (o.type == 'stripe')
    savePayMethod(null, o.info)
  else
    return cb(`${o.type} not supported a payment type`)
}


export function deletePaymethod(id, cb) {
  UserSvc.getSessionFull.call(this, (e, user) => {
    svc.getById(id, (e, r) => {
      var inValid = Validate.deletePayMethodById(this.user, r)
      if (inValid) return cb(svc.Forbidden(inValid))
      svc.deleteById(id, cb)
      if (_.idsEqual(user.primaryPayMethodId,id))
      UserSvc.update.call(this, user._id, { primaryPayMethodId: null })
    })
  })
}



export function getMyPaymethods(cb) {
  if (!this.user) return Braintree.getClientToken(cb)

  var companyIds = [] // TODO read companies user belongs too
  svc.searchMany({$or: [{userId:this.user._id},{companyId: {$in:companyIds}}]}, null, (e,r) => {
    if (e) return cb(e,r)
    if (r.length > 0) return cb(e,r)
    else {
      Settings.findOne({userId:this.user._id}, (ee, s) => {
        if (!s || !s.paymentMethods)
          return Braintree.getClientToken(cb)

        var existing = _.find(s.paymentMethods, (pm) => pm.type == 'stripe')
        if (!existing) return cb(e,r)
        else {
          var {info,type} = existing
          addPaymethod.call(this, {info,type,userId:this.user._id,name:`${this.user.name}'s card`,makeDefault:true}, (eee, pm) => {
            if (eee) return cb(eee)
            cb(null,[pm])
          })
        }
      })
    }
  })
}


