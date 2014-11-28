var stripe = require('stripe')(config.payments.stripe.secretKey)

module.exports = {
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
    stripe.charges.create(payload, function(err, charge) {
      if (err) cb(err)
      // if (winston) {
      //   winston.log("StripResponse: ", charge);
      // }
      charge.type = "stripe"
      cb(null, charge)
    })
  }

  // StripeService.prototype.createAnonCharge = function(charge, callback) {
  //   var payload;
  //   $log('svc.createAnonCharge', charge);
  //   payload = {
  //     card: charge.id,
  //     currency: "usd",
  //     amount: charge.amount
  //   };
  //   $log('svc.createAnonCharge.payload', payload);
  //   return stripe.charges.create(payload, (function(_this) {
  //     return function(err, charge) {
  //       if (err) {
  //         return callback(err);
  //       }
  //       if (config.isProd) {
  //         winston.log("StripResponse: ", charge);
  //       }
  //       return callback(null, charge);
  //     };
  //   })(this));
  // };

}
