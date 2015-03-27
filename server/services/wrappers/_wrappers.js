var logging                 = true


var initAPIWrap = (wrapper) => {
  var init = wrapper.init
  wrapper = _.wrapFnList(wrapper, (fn, fnName) => {
    return function() {
      if (!wrapper.api) {
        //this. ugly solution
        wrapper.init()
        if (logging) $log('initApi'.yellow, fnName)
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
  StackExchange:  initAPIWrap(require('./stackexchange')),
}



module.exports = wrappers
