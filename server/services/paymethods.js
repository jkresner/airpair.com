import Svc from './_service'
import PayMethod from '../models/paymethod'
import * as CompanysSvc from './companys'
var UserSvc         = require('./users')
var Braintree = global.Braintree || require('./wrappers/braintree')
var Stripe = require('./wrappers/stripe')
var PayPal = require('./wrappers/paypal')
var {Settings} = require('../models/v0')
var logging = false
var svc = new Svc(PayMethod, logging)


var get = {
  getById(id, cb) {
    var user = this.user
    svc.getById(id, (ee, pm) => {
      if (pm)
      {
        if (pm.userId == user._id) return cb(null, pm) // PayMethod added by user

        // Otherwise double check if it's a company PayMethod
        get.getMyPaymethods.call({user}, (e,r) => {
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
  },
  getMyPaymethods(cb) {
    if (!this.user) return Braintree.getClientToken(cb)
    var ctx = this

    CompanysSvc.getUsersCompany.call(ctx, (e, company) => {
      var companyIds = [] // TODO read companies user belongs too
      if (company) companyIds.push(company._id)

      svc.searchMany({$or: [{userId:ctx.user._id},{companyId: {$in:companyIds}}]}, null, (e,r) => {
        if (e) return cb(e,r)
        var nonPayoutMethods = []
        if (r.length > 0) {
          for (var pm of r) {
            if (pm.type.indexOf('payout') == -1) nonPayoutMethods.push(pm)
          }
        }

        if (nonPayoutMethods.length > 0) return cb(e,nonPayoutMethods)
        else {
          Settings.findOne({userId:ctx.user._id}, (ee, s) => {
            if (!s || !s.paymentMethods || s.paymentMethods.length == 0 || !_.find(s.paymentMethods,(pm)=>pm.type == 'stripe'))
              return Braintree.getClientToken(cb)

            var existing = _.find(s.paymentMethods, (pm) => pm.type == 'stripe')
            if (!existing) return cb(e,r)
            else {
              var {info,type} = existing
              save.addPaymethod.call(ctx, {info,type,userId:ctx.user._id,name:`${ctx.user.name}'s card`,makeDefault:true}, (eee, pm) => {
                if (eee) return cb(eee)
                cb(null,[pm])
              })
            }
          })
        }
      })

    })
  },
  getMyPayoutmethods(cb) {
    svc.searchMany({userId:this.user._id}, null, (e,r) => {
      if (e) return cb(e,r)
      var payoutMethods = []
      for (var pm of r) {
        if (pm.type.indexOf('payout') == 0) payoutMethods.push(pm)
      }
      return cb(e,payoutMethods)
    })
  },
  getUserPaymethodsByAdmin(userId, cb) {
    get.getMyPaymethods.call({user: {_id:userId}}, cb)
  },
  hasPaymethods(userId, cb) {
    CompanysSvc.getUsersCompany.call({user: {_id:userId}}, (e, company) => {
      var companyIds = [] // TODO read companies user belongs too
      if (company) companyIds.push(company._id)
      svc.searchMany({$or: [{userId},{companyId: {$in:companyIds}}]}, null, (e,r) => {
        if (e) return cb(e,r)
        if (_.where(r,(pm)=>pm.type.indexOf('payout')==-1).length > 0) return cb(null,true)
        else cb(null,false)
      })
    })
  }
}


var save = {
  addPaymethod(o, cb) {
    var customerId = (o.companyId != null) ? o.companyId : this.user._id

    var savePayMethod = (ctx) =>
      (ee, payMethodInfo) => {
        if (ee) return cb(ee)
        else {
          o.userId = ctx.user._id
          o.companyId = o.companyId
          o.info = payMethodInfo
          if (logging) $log('savePayMethod', payMethodInfo)

          svc.create(o, (e,r) => {
            if (logging) $log('savedPayMethod', o.makeDefault, ctx.user, r._id)

            if (ctx.user.email) { //-- When admin looks at request, don't trigger analtyics
              var cardType = payMethodInfo.cardType || payMethodInfo.id
              analytics.track(ctx.user, null, 'Save', { type: 'paymethod', method: o.type, cardType })
            }

            if (o.makeDefault)
              UserSvc.changePrimaryPayMethodId.call(ctx, r._id, () => {})
            cb(e, r)
          })
        }
      }

    if (o.type == 'braintree')
      Braintree.addPaymentMethod(customerId, this.user, null, o.token, savePayMethod(this))
    else if (o.type == 'stripe')
      savePayMethod(this)(null, o.info)
    else if (o.type == 'payout_paypal' && o.info.verified_account)
      savePayMethod(this)(null, o.info)
    else
      return cb(`${o.type} not supported a payment type`)
  },
  addOAuthPayoutmethod(provider, oAuthProfileInfo, oAuthTokenInfo, cb) {
    var pm = { type: `payout_${provider}`, info: oAuthProfileInfo }
    if (provider == 'paypal')
    {
      if (oAuthProfileInfo.verified_account != 'true')
        return cb(Error(`${oAuthProfileInfo.email} paypal account not verified. Please go to paypal.com and verify your account.`))

      pm.name = `Paypal ${oAuthProfileInfo.email}`
    }
    else {
      return cb(Error(`${provider} not a valid payout provider`))
    }
    save.addPaymethod.call(this, pm, cb)
  },
  deletePaymethod(paymethod, cb) {
    UserSvc.getSession.call(this, (e, user) => {
      if (_.idsEqual(user.primaryPayMethodId,paymethod._id))
        UserSvc.changePrimaryPayMethodId.call(this, null, () => {})
      Settings.remove({userId:this.user._id}, () => {})
      svc.deleteById(paymethod._id, cb)
    })
  },
  charge(amount, orderId, payMethod, cb) {
    if (payMethod.type == 'braintree')
      Braintree.chargeWithMethod(amount, orderId, payMethod.info.token, cb)
    else if (payMethod.type == 'stripe')
      Stripe.createCharge(amount, orderId, payMethod.info.id, cb)
    else
      return cb(`${payMethod.type} not supported a payment type`)
  },
  payout(amount, payoutId, payMethod, cb) {
    var note =
`Thank you.

Full detail of this payment can be found at:

https://www.airpair.com/payouts/${payoutId}
`
    if (payMethod.type == 'payout_paypal')
      PayPal.payout(payMethod.info.email, amount, payoutId, note, cb)
    else
      return cb(`${payMethod.type} not supported a payment type`)
  },
}


module.exports = _.extend(get, save)
