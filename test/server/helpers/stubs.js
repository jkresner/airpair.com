var analyticsSetup = {

  stubbed: false,

  on() {
    global.analytics    = require('../../../server/services/analytics').analytics
  },

  off() {
    global.analytics    = { track: ()=>{}, view: ()=>{}, alias: ()=>{}, identify: ()=>{} }
  }

}

var stubs = {

  analytics: analyticsSetup,

  stubBraintreeChargeWithMethod() {
    if (!Wrappers.Braintree.api) Wrappers.Braintree.init()
    return sinon.stub(Wrappers.Braintree.api.transaction,'sale', (payload, cb) => {
      var resp = _.clone(data.wrappers.braintree_charge_success)
      resp.transaction.amount = payload.amount.toString()
      resp.transaction.orderId = payload.orderId.toString()
      // resp.transaction.customer.id = userId.toString()
      // resp.transaction.customer.firstName = userId.toString()
      // resp.transaction.customer.lastName = userId.toString()
      // resp.transaction.customer.email = userId.toString()
      // $log('brain stub'.yellow, resp)
      cb(null, resp)
    })
  },

  stubPayPalPayout() {
    if (!Wrappers.PayPal.api) Wrappers.PayPal.init()
    return sinon.stub(Wrappers.PayPal.api.payout,'create', (payload,syncmode,cb) => {
      var resp = _.clone(data.wrappers.paypal_single_payout_success)
      resp.items[0].payout_item.receiver = payload.items[0].receiver
      resp.items[0].payout_item.amount = payload.items[0].amount.toString()
      cb(null, resp)
    })
  },

  stubBraintree(obj, fnName, err, response) {
    if (!Wrappers.Braintree.api) Wrappers.Braintree.init()
    return sinon.stub(Wrappers.Braintree.api[obj], fnName, (payload, cb) => {
      // $log('Braintree.stubbed', obj, fnName)
      cb(err, response)
    })
  },

  stubYouTube(obj, fnName, err, response) {
    if (!Wrappers.YouTube.api) Wrappers.YouTube.init()
    return sinon.stub(Wrappers.YouTube.api[obj], fnName, (payload, cb) => {
      // $log('YouTube.stubbed', obj, fnName)
      cb(err, response)
    })
  },

  stubGoogleTimezone(response) {
    return sinon.stub(Wrappers.Timezone,'getTimezoneFromCoordinates', (k,D,n,cb) => {
      cb(null, response || data.wrappers.timezone_melbourne)
    })
  },

  stubMailchimpLists(response) {
    return sinon.stub(MailChimpApi.prototype,'call', (a,b,c,cb) => {
      cb(null, response)
    })
  }

}

module.exports = stubs
