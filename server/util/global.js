// Couple of handy globals (this won't get out of hand)

module.exports = function(config)
{

  global._              = require('lodash')
  _.idsEqual            = require('../../shared/util').idsEqual
  global.moment         = require('moment')
  global.config         = config
  global.$log           = console.log
  global.$error         = require('./logging').logError


  if (config.analytics.on)
    global.analytics    = require('./../identity/analytics/analytics')
  else
    global.analytics    = { track: ()=>{}, view: ()=>{}, alias: ()=>{}, identify: ()=>{} }


  if (config.log.email)
  {
    global.winston      = require('winston')
    winston.remove(winston.transports.Console)
    winston.add(require('winston-ses').Ses, config.log.email)
  }

}
