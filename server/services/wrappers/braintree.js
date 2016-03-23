var logging                       = false
var {firstName,lastName}          = require('../../../shared/util')


//-- Delay initialization of api to first call to speed app load
var wrap = (fn, fnName) =>
  function () {
    var start = new Date()
    // var cb = arguments[arguments.length-1]
    // var wrappedCB = (operation, payload, translate) =>
      // (e,r) => {
      //   if (e) { $error(`braintree.${operation}.ERROR [${e}] ${JSON.stringify(payload)}`); cb(e) }
      //   else if (!r.success) { $error(`braintree.${operation}.ERROR [${r.message}] ${JSON.stringify(payload)}`); cb(r) }
      //   else {
      //     // $log('r', JSON.stringify(r).white)
      //     if (translate) r = translate(r)
      //     if (logging) $log(`braintree.${operation}`, r)
      //     r.type = "braintree"
      //     cb(null, r)
      //   }
      // }
    // arguments[arguments.length-1] = wrappedCB
    var args = [].slice.call(arguments)
    var cb = args.pop()
    args.push(function(e, r, payload) {
      // $log('back from api call'.white, e, r, payload)
      var duration = new Date() - start
      if (duration > 1000) console.log(`[braintree.${fnName}].slow`.cyan, `${duration}`.red)
      if (e) $error(`braintree.${fnName}.ERROR [${e.message}] ${JSON.stringify(payload)}`)
      else if (!r.success) {
        $error(`braintree.${fnName}.ERROR [${r.message}] ${JSON.stringify(payload)}`)
        e = r
      } else {
        // $log('r', JSON.stringify(r).white)
        r.type = "braintree"
      }
      cb.apply(this, arguments)
    })
    fn.apply(this, args)
  }


var wrapper = {

  init() {
    var braintree = global.API_BRAINTREE || require('braintree')
    var {merchantId, publicKey, privateKey} = config.wrappers.braintree
    var environment = braintree.Environment[config.wrappers.braintree.environment]
    this.api = braintree.connect({ environment, merchantId, publicKey, privateKey })
    addPaymentMethodOpts = {}; // { verifyCard: config.wrappers.braintree.verifyCards
  },

  getClientToken(cb) {
    var payload = {}
    this.api.clientToken.generate(payload, (e, r) => cb(e, r, payload))
  },

  chargeWithMethod(amount, orderId, paymentMethodToken, cb) {
    var payload = { amount, paymentMethodToken, options : { submitForSettlement: true } }
    payload.orderId = orderId.toString() // braintree complains if we give it a mongo.ObjectId

    this.api.transaction.sale(payload, (e, r) => cb(e, e?null:r, payload))
  },

  addPaymentMethod(customerId, user, company, paymentMethodNonce, cb) {
    this.api.customer.find(customerId, (ee, existing) => {
      if (existing)
      {
        var payload = { customerId, paymentMethodNonce }
        this.api.paymentMethod.create(payload, (e, r) =>
          cb(e, e?null:Object.assign({success:true},r.paymentMethod), payload))
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

        this.api.customer.create(payload, (e, r) => {
          console.log('braintree.customer.create', r)
          cb(e, e?null:Object.assign({success:true},r.customer.creditCards[0]), payload)
        })
      }
    })
  }
}

module.exports = _.wrapFnList(wrapper, wrap)
