var util = require('../../../shared/util')
var mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId

global.newId = function() {
  return new ObjectId()
}

global.timeSeed = function() {
  return moment().format('X')
}

global.getNewUserData = function(userKey)
{
  var seed = data.users[userKey]
  var suffix = moment().format('X')
  return {
    email: seed.email.replace('@',suffix+'@'),
    name: seed.name+suffix,
    password: 'testpass'+suffix,
    userKey: userKey + suffix
  }
}

global.newUserSession = function(userKey)
{
  var suffix = moment().format('X')
  var session = { cookie: {
    originalMaxAge: 2419200000,
    _expires: moment().add(2419200000, 'ms').subtract(1,'s') }
  }
  cookieCreatedAt = util.momentSessionCreated(session)
  return {user:null,sessionID:`test${userKey}${suffix}`,session}
}


var dataHelpers = {

  newId,

  // stubBraintreeAddCustomer() {
  //   return sinon.stub(Braintree,'addPaymentMethod', (customerId,cb) => {
  //     resp = _.clone(data.paymethods.braintree_visa)
  //     resp.info.customerId = customerId
  //     cb(null, resp)
  //   })
  // },

  stubBraintreeChargeWithMethod() {
    return sinon.stub(Braintree,'chargeWithMethod', (amount, orderId, pToken, cb) => {
      var resp = _.clone(data.wrappers.braintree_charge_success)
      resp.type = "braintree"
      resp.transaction.amount = amount.toString()
      resp.transaction.orderId = orderId.toString()
      // resp.transaction.customer.id = userId.toString()
      // resp.transaction.customer.firstName = userId.toString()
      // resp.transaction.customer.lastName = userId.toString()
      // resp.transaction.customer.email = userId.toString()
      // $log('brain stub'.yellow, resp)
      cb(null, resp)
    })
  },

  stubPayPalPayout() {
    return sinon.stub(paypal.payout,'create', (payload,syncmode,cb) => {
      var resp = _.clone(data.wrappers.paypal_single_payout_success)
      resp.items[0].payout_item.receiver = payload.items[0].receiver
      resp.items[0].payout_item.amount = payload.items[0].amount.toString()
      cb(null, resp)
    })
  },


  getNewExpertUserData(userKey) {
    var seed = _.clone(data.users[userKey])
    if (!seed || !seed.email) $log('getNewExpertUserData failed need seed user with email'.red)

    seed._id = new ObjectId

    var suffix = moment().format('X')
    seed.email = seed.email.replace('@',suffix+'@'),
    seed.name = seed.name+suffix
    seed.username = seed.name.replace(/ /g,'').toLowerCase()
    seed.password = 'testpass'+suffix
    seed.userKey = userKey + suffix

    if (seed.google) {
      seed.google.id = seed.google.id + suffix
      seed.googleId = seed.google.id
    }

    return seed
  },

  getNewExpertData(userKey, user) {
    var seed = _.clone(data.experts[userKey])
    if (!seed || !seed.email) $log('getNewExpertData failed, need seed expert'.red)

    seed._id = new ObjectId
    seed.userId = user._id
    seed.name = user.name
    seed.username = user.name.replace(/ /g,'').toLowerCase()
    return seed
  }

}

module.exports = dataHelpers
