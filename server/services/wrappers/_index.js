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


var plumbWrapped = function(name) {
  var wrapper = require(`../../wrappers/${name.toLowerCase()}`)
  var wrapped = (fn, fnName) => function() {
    if (!Wrappers[name].api) {
      Wrappers[name].init()
      $logIt('wrpr.init', 'init', name, fnName)
    }
    return fn.apply(this, arguments)
  }

  global.Wrappers[name] = { init: wrapper.init }
  for (var fn in wrapper)
    if (fn != 'init' && fn != 'name')
      global.Wrappers[name][fn] = wrapped(wrapper[fn], fn)

  $logIt('app.wire', `wiredWrapper:${name}`, _.keys(Wrappers[name]))
}


module.exports = {
  Bitly:          initAPIWrap('Bitly'),
  Braintree:      initAPIWrap('Braintree'),
  Calendar:       initAPIWrap('Calendar', 'gcal'),
  Slack:          initAPIWrap('Slack'),
  StackExchange:  initAPIWrap('StackExchange'),
  Stripe:         initAPIWrap('Stripe'),
  Timezone:       initAPIWrap('Timezone', 'gtimezone'),
  Twitter:        initAPIWrap('Twitter'),
  YouTube:        initAPIWrap('YouTube'),

  // MailChimp:      initAPIWrap('MailChimp'),
  // GitPublisher:   initAPIWrap('GitPublisher'),
  plumbWrapped,
}
