var logging                       = false
var {firstName,lastName}          = require('../../../shared/util')
var api                           = null
var addPaymentMethodOpts          = null


//-- Delay initialization of api to first call to speed app load
var wrap = (fn, fnName) =>
  function () {

    var cb = arguments[arguments.length-1]
    var wrappedCB = (operation, payload, translate) =>
      (e,r) => {
        if (e) { $error(`braintree.${operation}.ERROR [${e}] ${JSON.stringify(payload)}`); errorCB(e) }
        else if (!r.success) { $error(`braintree.${operation}.ERROR [${r.message}] ${JSON.stringify(payload)}`); errorCB(r) }
        else {
          // $log('r', JSON.stringify(r).white)
          if (translate) r = translate(r)
          if (logging) $log(`braintree.${operation}`, r)
          r.type = "braintree"
          cb(null, r)
        }
      }
    arguments[arguments.length-1] = wrappedCB
    fn.apply(this, arguments)
  }


var wrapper = {

  init() {
    var braintree = global.API_BRAINTREE || require('braintree')
    var {merchantId, publicKey, privateKey} = config.payments.braintree
    var environment = braintree.Environment[config.payments.braintree.environment]
    wrapper.api = braintree.connect({ environment, merchantId, publicKey, privateKey })
    addPaymentMethodOpts = {}; // { verifyCard: config.payments.braintree.verifyCards
  },

  getClientToken(cb) {
    wrapper.api.clientToken.generate({}, cb('clientToken.generate',{},(r)=> {
      return { btoken: r.clientToken } }))
  },

  chargeWithMethod(amount, orderId, paymentMethodToken, cb) {
    orderId = orderId.toString() // braintree complains if we give it a mongo.ObjectId
    var payload = { amount, orderId, paymentMethodToken, options : { submitForSettlement: true } }

    wrapper.api.transaction.sale(payload, cb('transaction.sale', payload, null))
  },

  addPaymentMethod(customerId, user, company, paymentMethodNonce, cb) {
    wrapper.api.customer.find(customerId, function (ee, existing) {
      if (existing)
      {
        var payload = { customerId, paymentMethodNonce }
        wrapper.api.paymentMethod.create(payload, cb('paymentMethod.create', payload, (r) => r.paymentMethod))
      }
      else
      {
        var payload = {
          id: customerId,
          firstName: util.firstName(user.name),
          lastName: util.lastName(user.name),
          email: user.email,
          customFields: {
            createdByUserId: user._id.toString()
          },
          paymentMethodNonce,
          // addPaymentMethodOpts
        }

        if (company) {
          payload.company = company.name
          payload.customFields.companyId = company._id.toString()
        }

        wrapper.api.customer.create(payload, cb('customer.create', payload, (r) => r.customer.creditCards[0]))
      }
    })
  }
}

module.exports = _.wrapFnList(wrapper, wrap)
