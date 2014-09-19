
// Couple of handy globals (this won't get out of hand)
module.exports = function(config)
{
  global._              = require('lodash')
  global.moment         = require('moment')
  global.$log           = console.log
  global.config         = config
}