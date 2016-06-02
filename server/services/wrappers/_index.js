var logging                 = true
function wrapFnList(fnsObj, wrapFn) {
  for (var name in fnsObj)
    fnsObj[name] = wrapFn(fnsObj[name], name)
  return fnsObj
}

var initAPIWrap = (wrapperName, wrapperFile) => {
  setTimeout(()=>{
    wrapperFile = wrapperFile || wrapperName.toLowerCase()
    var wrapper = require(`./${wrapperFile}`)

    var init = wrapper.init
    wrapper = wrapFnList(wrapper, (fn, fnName) => {
      return function() {
        if (!wrapper.api) {
          //this. ugly solution
          wrapper.init()
          if (logging) $log(`initApi.${wrapperName}`.white, fnName)
        }
        return fn.apply(this, arguments)
      }}
    )
    wrapper.init = init
    global.Wrappers[wrapperName] = wrapper
  })
  return {}
}


module.exports = {
  Timezone:       initAPIWrap('Timezone', 'gtimezone'),
  Calendar:       initAPIWrap('Calendar', 'gcal'),
  GitPublisher:   initAPIWrap('GitPublisher'),
  Stripe:         initAPIWrap('Stripe'),
  Braintree:      initAPIWrap('Braintree'),
  YouTube:        initAPIWrap('YouTube'),
  Slack:          initAPIWrap('Slack'),
  StackExchange:  initAPIWrap('StackExchange'),
  Twitter:        initAPIWrap('Twitter'),
  Bitly:          initAPIWrap('Bitly'),
  MailChimp:      initAPIWrap('MailChimp'),
}
