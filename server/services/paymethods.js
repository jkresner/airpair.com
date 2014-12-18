import Svc from './_service'
import * as Validate from '../../shared/validation/billing.js'
import PayMethod from '../models/paymethod'
import * as UserSvc from './users'
import * as CompanysSvc from './companys'
import * as Braintree from './wrappers/braintree'
var Stripe = require('./wrappers/stripe')
var Settings = require('../models/v0').Settings


var logging = false
var svc = new Svc(PayMethod, logging)


export function getById(id, cb) {
  var user = this.user
  svc.getById(id, (ee, pm) => {
    if (pm)
    {
      if (pm.userId == user._id) return cb(null, pm) // PayMethod added by user

      // Otherwise double check if it's a company PayMethod
      getMyPaymethods.call({user}, (e,r) => {
        var rpm = _.find(r,(p)=>_.idsEqual(id,p._id))
        if (rpm) return cb(null, rpm)
        else {
          $error(`Valid payMthod[${id}] for user not found`, user)
          cb(`Valid payment method not found`)
        }
      })
    }
    else
      cb(ee,null)
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
        if (logging) $log('savedPayMethod', o.makeDefault, user._id, o)
        analytics.track(user, {}, 'Save', { type: 'paymethod', method: o.type })
        if (o.makeDefault)
          UserSvc.update.call(this, user._id, { primaryPayMethodId: r._id })
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
      Settings.remove({userId:this.user._id}, () => {})
      UserSvc.update.call(this, user._id, { primaryPayMethodId: null })
    })
  })
}



export function getMyPaymethods(cb) {
  if (!this.user) return Braintree.getClientToken(cb)

  CompanysSvc.getUsersCompany.call( this, (e, company) => {
    var companyIds = [] // TODO read companies user belongs too
    if (company) companyIds.push(company._id)

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

  })

}


