var util = require('../../../shared/util')
var braintree = require('braintree')

var {merchantId, publicKey, privateKey} = config.payments.braintree
var environment = braintree.Environment[config.payments.braintree.environment]

var gateway = braintree.connect({ environment, merchantId, publicKey, privateKey })

var logging = false


var logCB = (operation, payload, cb) =>
	(e,r) => {
		if (e) { $log(`braintree.${operation}.ERROR`, e, payload); cb(e) }
		else if (!r.success) { $log(`braintree.${operation}.ERROR`, r.message, r, payload); cb(r) }
		else {
			if (logging) $log(`braintree.${operation}`, r)
			cb(null, r)
		}
	}


export function getClientToken(argument, cb) {
	gateway.clientToken.generate({ customerId: this.userId}, (e, response) => {
	  cb(e, response.clientToken)
	})
}


export function chargeWithMethod(amount, orderId, paymentMethodToken, cb) {
	gateway.transaction.sale({
	  amount, //'10.00',
	  orderId,
	  paymentMethodToken
	}, cb)
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
			gateway.paymentMethod.create(payload, logCB('paymentMethod.create', payload, (e,r) => cb(null, r.paymentMethod)))
		}
		else
		{
			var payload = {
			  id: customerId,
			  firstName: util.firstName(user.name),
			  lastName: util.lastName(user.name),
				email: user.email,
				customFields: {
					createdByUserId: user._id
				},
				paymentMethodNonce,
				// options
			}

			if (company) {
				payload.company = company.name
				payload.customFields.companyId = company._id
			}

			gateway.customer.create(payload, logCB('customer.create', payload, (e,r) => cb(null, r.customer.creditCards[0])))
		}
	})
}
