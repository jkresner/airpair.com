 var wrapper = {

  init() {
    wrapper.api = global.API_STRIPE
        || require('stripe')(config.payments.stripe.secretKey)
  },

  createCharge(amount, orderId, customerId, cb) {
    var payload = {
      customer: customerId,
      amount: amount * 100,
      currency: "usd"
    };
    // console.log('striping', payload, cb)
    wrapper.api.charges.create(payload, function(err, charge) {
      if (err) return cb(err)
      charge.type = "stripe"
      cb(null, charge)
    })
  }

}


module.exports = wrapper
