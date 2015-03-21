var analyticsSetup = {

  stubbed: false,

  stub()
  {
    if (analyticsSetup.stubbed) return
    global.trackStub = sinon.stub(analytics,'track', (p1,p2,p3,p4,p5,cb) => { if (cb) cb() })
    global.viewStub = sinon.stub(analytics,'view', (p1,p2,p3,p4,p5,p6,cb) => { if (cb) cb() })
    global.identifyStub = sinon.stub(analytics,'identify', (p1,p2,p3,p4,cb) => { if (cb) cb() })
    global.aliasStub = sinon.stub(analytics,'alias', (p1,p2,p3,cb) => { if (cb) cb() })
    analyticsSetup.stubbed = true
  },

  restore()
  {
    global.trackStub.restore()
    global.identifyStub.restore()
    global.aliasStub.restore()
    global.viewStub.restore()
    analyticsSetup.stubbed = false
  },

  withNoAnalytics(fn, args) {
    var args = [].slice.call(args)

    if (analyticsSetup.stubbed = false) {
      var done = args.pop()
      var doneWithStub = (e,r) => {
        analyticsSetup.restore()
        done(e,r)
      }
      args.push(doneWithStub)
      analyticsSetup.stub()
    }

    fn.apply({}, args)
  },

  storyWithNoAnalytics(story) {
    return function() { analyticsSetup.withNoAnalytics(story, arguments) }
  }

}

var stubs = {

  analytics: analyticsSetup,

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

  stubGoogleTimezone(response) {
    return sinon.stub(TimezoneApi,'data', (k,D,n,cb) => {
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
