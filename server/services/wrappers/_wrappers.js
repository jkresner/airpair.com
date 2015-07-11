var logging                 = true


var initAPIWrap = (wrapperName, wrapper) => {
  var init = wrapper.init
  wrapper = _.wrapFnList(wrapper, (fn, fnName) => {
    return function() {
      if (!wrapper.api) {
        //this. ugly solution
        wrapper.init()
        if (logging) $log(`initApi.${wrapperName}`.wrappercall, fnName)
      }
      return fn.apply(this, arguments)
    }}
  )
  wrapper.init = init
  return wrapper
}



var wrappers = {
  Timezone:       initAPIWrap('Timezone', require('./gtimezone')),
  Calendar:       initAPIWrap('Calendar', require('./gcal')),
  GitHub:         initAPIWrap('GitHub', require('./github')),
  PayPal:         initAPIWrap('PayPal', require('./paypal')),
  Stripe:         initAPIWrap('Stripe', require('./stripe')),
  Braintree:      initAPIWrap('Braintree', require('./braintree')),
  YouTube:        initAPIWrap('YouTube', require('./youtube')),
  Slack:          initAPIWrap('Slack', require('./slack')),
  StackExchange:  initAPIWrap('StackExchange', require('./stackexchange')),
  Twitter:        initAPIWrap('Twitter', require('./twitter')),
  Bitly:          initAPIWrap('Bitly', require('./bitly')),
  MailChimp:      initAPIWrap('MailChimp', require('./mailchimp')),
}



module.exports = wrappers
