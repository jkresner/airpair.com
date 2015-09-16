var colors           = require('colors')
global.$timelapsed   = require('./log/timelapsed')


module.exports = {
  colors:         colors,
  initConfig:     require('./config'),
  initGlobals:    require('./globals')
}
