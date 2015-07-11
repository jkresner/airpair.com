var logging                 = true


var initAPIWrap = (wrapper) => {
  var init = wrapper.init
  wrapper = _.wrapFnList(wrapper, (fn, fnName) => {
    return function() {
      if (!wrapper.api) {
        //this. ugly solution
        wrapper.init()
        if (logging) $log('initApi'.wrappercall, fnName)
      }
      return fn.apply(this, arguments)
    }}
  )
  wrapper.init = init
  return wrapper
}



var wrappers = {
  Timezone:       initAPIWrap(require('./gtimezone')),
  Calendar:       initAPIWrap(require('./gcal')),
  GitHub:         initAPIWrap(require('./github')),
  PayPal:         initAPIWrap(require('./paypal')),
  Stripe:         initAPIWrap(require('./stripe')),
  Braintree:      initAPIWrap(require('./braintree')),
  YouTube:        initAPIWrap(require('./youtube')),
  Slack:          initAPIWrap(require('./slack')),
  StackExchange:  initAPIWrap(require('./stackexchange')),
  Twitter:        initAPIWrap(require('./twitter')),
  Bitly:          initAPIWrap(require('./bitly')),
  MailChimp:      initAPIWrap(require('./mailchimp')),
}



module.exports = wrappers
