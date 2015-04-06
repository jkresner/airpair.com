 var wrapper = {

  init() {
    wrapper.api = global.API_STRIPE
        || require('stripe')(config.payments.stripe.secretKey)
  },

  // StripeService.prototype.createCustomer = function(email, token, callback) {
  //   return stripe.customers.create({
  //     email: email,
  //     card: token
  //   }, (function(_this) {
  //     return function(err, customer) {
  //       if (err) {
  //         return callback(err);
  //       }
  //       return callback(null, customer);
  //     };
  //   })(this));
  // };

  createCharge(amount, orderId, customerId, cb) {
    var payload = {
      customer: customerId,
      amount: amount * 100,
      currency: "usd"
    };
    // console.log('striping', payload, cb)
    wrapper.api.charges.create(payload, function(err, charge) {
      if (err) return cb(err)
      // if (winston) {
      //   winston.log("StripResponse: ", charge);
      // }
      charge.type = "stripe"
      cb(null, charge)
    })
  }

}


module.exports = wrapper
