
// Couple of handy globals (this won't get out of hand)
module.exports = function(config)
{
  global.util           = require('../../shared/util')
  global._              = require('lodash')
  _.idsEqual            = util.idsEqual
  _.wrapFnList          = util.wrapFnList
  // global.moment         = require('moment')
  global.moment         = require('moment-timezone')
  global.config         = config
  global.$log           = console.log
  global.$error         = require('./log/error')

  //-- Consistent way to call services from a function with request context
  global.$callSvc       = (fn, ctx) =>
    function() {
      var thisCtx = { user: ctx.user, sessionID: ctx.sessionID, session: ctx.session }
      // $log('fn', fn, thisCtx, arguments)
      fn.apply(thisCtx, arguments)
    }

  global.mailman = {
    init() { global.mailman = require('./mail/mailman')(config.mail.smtpProvider()) }
  }

  global.pairbot = {
    init() { global.pairbot = require('./im/pairbot')() }
  }

  //-- makes app a tests load 300ms faster
  global.analytics    = { track: ()=>{}, view: ()=>{}, alias: ()=>{}, identify: ()=>{}, impression: ()=>{} }

  if (config.log.email)
  {
    global.winston      = require('winston')
    winston.remove(winston.transports.Console)
    winston.add(require('winston-ses').Ses, config.log.email)
  }

  global.Wrappers       = require('../services/wrappers/_wrappers')

  //-- Services we want to stub can be set on global here
  if (config.env == 'test')
  {
    global.MailChimpApi   = require('mailchimp/lib/mailchimp/MailChimpAPI_v2_0')
  }
  else
  {
    if (config.analytics.on)
      global.analytics    = require('./../services/analytics').analytics
  }
}






