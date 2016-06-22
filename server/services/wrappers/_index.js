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


module.exports = assign(global.Wrappers, {
  Bitly:          initAPIWrap('Bitly'),
  Braintree:      initAPIWrap('Braintree'),
  Calendar:       initAPIWrap('Calendar', 'gcal'),
  Slack:          initAPIWrap('Slack'),
  Stripe:         initAPIWrap('Stripe'),
  Twitter:        initAPIWrap('Twitter'),
  YouTube:        initAPIWrap('YouTube')
})
