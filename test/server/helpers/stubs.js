var emptyStub = () => sinon.stub({fake:()=>{}},'fake',()=>{})

var analyticsSetup = {

  stubbed: false,

  on() {
    global.analytics    = require('../../../server/services/analytics').analytics
  },

  off() {
    global.analytics    = { echo: ()=>{}, event: ()=>{}, view: ()=>{}, alias: ()=>{}, identify: ()=>{} }
  }

}

var stubs = {

  analytics: analyticsSetup,


  // stubYouTube(obj, fnName, err, response) {
  //   if (global.withoutStubs) return emptyStub()
  //   if (!Wrappers.YouTube.api) Wrappers.YouTube.init()
  //   return sinon.stub(Wrappers.YouTube.api[obj], fnName, (payload, cb) => {
  //     // $log('YouTube.stubbed', obj, fnName)
  //     cb(err, response)
  //   })
  // },


  // stubStackOverflowTagInfo(response) {
  //   if (withoutStubs) return emptyStub()
  //   if (!Wrappers.StackExchange.api) Wrappers.StackExchange.init()
  //   return sinon.stub(Wrappers.StackExchange.api, 'get', (url, cb) => {
  //     $log('StackExchange.stubbed', response)
  //     cb(null, {ok:true,body:response})
  //   })
  // },


  // stubGoogleCalendar(objectName, fnName, response) {
  //   if (global.withoutStubs) return emptyStub()
  //   if (!Wrappers.Calendar.api) Wrappers.Calendar.init()
  //   return sinon.stub(Wrappers.Calendar.api[objectName], fnName, (obj,cb) => {
  //     cb(null, response)
  //   })
  // },


  stubGoogleTimezone(response) {
    if (global.withoutStubs) return emptyStub()
    return sinon.stub(Wrappers.Timezone,'getTimezoneFromCoordinates', (loc,n,cb) => {
      cb(null, response || data.wrappers.timezone_melbourne)
    })
  },

  // stubSlack(fnName, result) {
  //   if (withoutStubs) return emptyStub()
  //   if (!Wrappers.Slack.api) Wrappers.Slack.init()
  //   return sinon.stub(Wrappers.Slack, fnName, function() {
  //     if (fnName == "getUsers") cache.slack_users = result
  //     if (fnName == "getGroups") cache.slack_groups = result
  //     var cb = arguments[arguments.length-1]
  //     // $log(`Slack.${fnName}.stubbed`, result)
  //     cb(null, result)
  //   })
  // },

  // stubSlackSync(fnName, result) {
  //   if (global.withoutStubs) return emptyStub()
  //   return sinon.stub(Wrappers.Slack, fnName, function() {
  //     return result
  //   })
  // }

}


module.exports = stubs
