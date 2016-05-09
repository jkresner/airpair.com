var logging            = false
var Rates              = require('./requests.rates')
var {Paymethod,User}   = DAL

var CompanysSvc        = require('./companys')
var UserSvc            = require('./users')


var get = {
  getById(id, cb) {
    var user = this.user
    Paymethod.getById(id, (ee, pm) => {
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
    if (!this.user) return Wrappers.Braintree.getClientToken(cb)
    var ctx = this

    CompanysSvc.getUsersCompany.call(ctx, (e, company) => {
      var companyIds = [] // TODO read companies user belongs too
      if (company) companyIds.push(company._id)
      Paymethod.getManyByQuery({$or: [{userId:ctx.user._id},{companyId: {$in:companyIds}}]}, null, (e,r) => {
        if (e) return cb(e,r)
        var nonPayoutMethods = []
        for (var pm of r||[])
          if (pm.type.indexOf('payout') == -1) nonPayoutMethods.push(pm)

        if (nonPayoutMethods.length == 0)
          return Wrappers.Braintree.getClientToken((e,r)=>
                          cb(e, e?null: {btoken:r.clientToken}))
        else
          cb(e, nonPayoutMethods)
        // if (nonPayoutMethods.length > 0) return cb(e,nonPayoutMethods)
        // else {
        //   Settings.findOne({userId:ctx.user._id}, (ee, s) => {

        //     var existing = _.find(s.paymentMethods, (pm) => pm.type == 'stripe')
        //     if (!existing) return cb(e,r)
        //     else {
        //       var {info,type} = existing
        //       save.addPaymethod.call(ctx, {info,type,userId:ctx.user._id,name:`${ctx.user.name}'s card`,makeDefault:true}, (eee, pm) => {
        //         if (eee) return cb(eee)
        //         cb(null,[pm])
        //       })
        //     }
        //   })
        // }
      })

    })
  },
  getMyPayoutmethods(cb) {
    Paymethod.getManyByQuery({userId:this.user._id}, null, (e,r) => {
      if (e) return cb(e,r)
      var payoutMethods = []
      for (var pm of r) {
        if (pm.type.indexOf('payout') == 0) payoutMethods.push(pm)
      }
      return cb(e,payoutMethods)
    })
  },
  getUserPaymethodsByAdmin(userId, cb) {
    get.getMyPaymethods.call({user:{_id:userId}},(e,r)=>{
      if (e) return cb(e)
      if (r.btoken) return cb(null,[])
      else cb(null,r)
    })
  },
  hasPaymethods(userId, cb) {
    CompanysSvc.getUsersCompany.call({user: {_id:userId}}, (e, company) => {
      var companyIds = [] // TODO read companies user belongs too
      if (company) companyIds.push(company._id)
      Paymethod.getManyByQuery({$or: [{userId},{companyId: {$in:companyIds}}]}, null, (e,r) => {
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

          Paymethod.create(o, (e,r) => {
            if (logging) $log('savedPayMethod', o.makeDefault, ctx.user, r._id)

            if (ctx.user.email) { //-- When admin looks at request, don't trigger analtyics
              var cardType = payMethodInfo.cardType || payMethodInfo.id
              // analytics.event.call(ctx, 'Save', { type: 'paymethod', method: o.type, cardType })
            }

            if (o.makeDefault)
              UserSvc.changePrimaryPayMethodId.call(ctx, r._id, () => {})
            cb(e, r)
          })
        }
      }

    if (o.type == 'braintree') {
      Wrappers.Braintree.addPaymentMethod(customerId, this.user, null, o.token, savePayMethod(this))
      mailman.sendTemplate('pipeliner-notify-addpaymethod', {byName:this.user.name}, 'pipeliners')
    }
    else if (o.type == 'stripe')
      savePayMethod(this)(null, o.info)
    else if (o.type == 'payout_paypal' && o.info.verified_account)
      savePayMethod(this)(null, o.info)
    else
      return cb(`${o.type} not supported a payment type`)
  },

  deletePaymethod(paymethod, cb) {

    User.getById(this.user._id, (e, user) => {
      if (user.primaryPayMethodId && _.idsEqual(user.primaryPayMethodId,paymethod._id))
        User.updateUnset(this.user._id, ['primaryPayMethodId'], () => {})
      // Settings.remove({userId:this.user._id}, () => {})
      Paymethod.delete(paymethod, cb)
    })
  },
  charge(amount, orderId, payMethod, cb) {
    if (payMethod.type == 'braintree')
      Wrappers.Braintree.chargeWithMethod(amount, orderId, payMethod.info.token, cb)
    else if (payMethod.type == 'stripe')
      Wrappers.Stripe.createCharge(amount, orderId, payMethod.info.id, cb)
    else
      return cb(`${payMethod.type} not supported a payment type`)
  }
}


module.exports = _.extend(get, save)
