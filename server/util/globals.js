
// Couple of handy globals (this won't get out of hand)
module.exports = function(config, _analytics)
{
  global.util           = require('../../shared/util')
  global._              = require('lodash')
  _.idsEqual            = util.idsEqual
  _.wrapFnList          = util.wrapFnList
  // global.moment         = require('moment-timezone')
  // global.$log           = console.log
  global.$trace         = require('./log/trace')
  global.$error         = require('./log/error')
  //-- Consistent way to call services from a function with request context
  global.$callSvc       = (fn, ctx) =>
    function() {
      var thisCtx = { user: ctx.user, sessionID: ctx.sessionID, session: ctx.session }
      // $log('fn', fn, thisCtx, arguments)
      fn.apply(thisCtx, arguments)
    }
  global.$require       = (path, obj) =>
    function() {
      if (!obj) obj = require(path)
      return obj
    }

  //-- makes app a tests load 300ms faster
  // global.analytics    = { echo: ()=>{}, event: ()=>{}, view: ()=>{}, alias: ()=>{}, impression: ()=>{} }
  global.Wrappers     = require('../services/wrappers/_index')

  //-- Services we want to stub can be set on global here
  // if (config.env == 'test')
  // {
    // global.MailChimpApi   = require('mailchimp/lib/mailchimp/MailChimpAPI_v2_0')
  // }
  // else
  // {
    // if (config.analytics.on)
      // global.analytics = require('./../services/analytics')(_analytics)

  // }
}






