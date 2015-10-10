var colors           = require('colors')
global.$timelapsed   = require('./log/timelapsed')


global.V2DeprecatedError = (fnName) =>
  Error(fnName+' deprecated in v2 migration. How did the UX get you here??')


module.exports = {
  colors:         colors,
  initConfig:     require('./config'),
  initGlobals:    require('./globals')
}
