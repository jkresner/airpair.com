var util = require('../../../shared/util')
var braintree = require('braintree')

var {merchantId, publicKey, privateKey} = config.payments.braintree
var environment = braintree.Environment[config.payments.braintree.environment]

var gateway = braintree.connect({ environment, merchantId, publicKey, privateKey })

var logging = false


var logCB = (operation, payload, errorCB, cb) =>
  (e,r) => {
    if (e) { $error(`braintree.${operation}.ERROR [${e}] ${JSON.stringify(payload)}`); errorCB(e) }
    else if (!r.success) { $error(`braintree.${operation}.ERROR [${r.message}] ${JSON.stringify(payload)}`); errorCB(r) }
    else {
      if (logging) $log(`braintree.${operation}`, r)
      cb(null, r)
    }
  }


export function getClientToken(cb) {
  gateway.clientToken.generate({}, (e, response) => {
    if (e) return cb(e)
    cb(null, { btoken: response.clientToken })
  })
}


export function chargeWithMethod(amount, orderId, paymentMethodToken, cb) {
  orderId = orderId.toString() // braintree complains if we give it a mongo.ObjectId
  var payload = { amount, orderId, paymentMethodToken }

  gateway.transaction.sale(payload, logCB('transaction.sale', payload, cb,
    (e,r) => { r.type = "braintree"; cb(e,r) }))
}


export function addPaymentMethod(customerId, user, company, paymentMethodNonce, cb) {
  var options = {}; // {
    // verifyCard: config.payments.braintree.verifyCards
    // verificationMerchantAccountId: "theMerchantAccountId"
  // }

  gateway.customer.find(customerId, function (ee, existing) {
    if (existing)
    {
    	var payload = { customerId, paymentMethodNonce }
    	gateway.paymentMethod.create(payload, logCB('paymentMethod.create', payload, cb,
        (e,r) => cb(null, r.paymentMethod)))
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
        // options
      }

      if (company) {
        payload.company = company.name
        payload.customFields.companyId = company._id.toString()
      }

      gateway.customer.create(payload, logCB('customer.create', payload, cb,
        (e,r) => cb(null, r.customer.creditCards[0])))
    }
  })
}
