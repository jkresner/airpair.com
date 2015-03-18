// Couple of handy globals (this won't get out of hand)

module.exports = function(config)
{

  global._              = require('lodash')
  _.idsEqual            = require('../../shared/util').idsEqual
  global.moment         = require('moment')
  global.config         = config
  global.$log           = console.log
  global.$error         = require('./logging').logError

  //-- Consistent way to call services from a function with request context
  global.$callSvc       = (fn, ctx) =>
    function() {
      var thisCtx = { user: ctx.user, sessionID: ctx.sessionID, session: ctx.session }
      // $log('fn', fn, thisCtx, arguments)
      fn.apply(thisCtx, arguments)
    }


  if (config.analytics.on)
    global.analytics    = require('./../services/analytics').analytics
  else
    global.analytics    = { track: ()=>{}, view: ()=>{}, alias: ()=>{}, identify: ()=>{} }


  global.mailman = {
    init() { global.mailman = require('./mail/mailman')(config.mail.smtpProvider()) }
  }

  if (config.log.email)
  {
    global.winston      = require('winston')
    winston.remove(winston.transports.Console)
    winston.add(require('winston-ses').Ses, config.log.email)
  }

  //-- Services we want to stub can be set on global here
  if (config.env == 'test')
  {
    global.paypal         = require('paypal-rest-sdk')
    global.Braintree      = require('../services/wrappers/braintree')
    global.Timezone       = require('node-google-timezone')
    global.MailChimpApi   = require('mailchimp/lib/mailchimp/MailChimpAPI_v2_0')
    // global.GitHubApi      = () => {}
  }
  else
  {
    // global.GitHubApi      = () => {}
  }

}
