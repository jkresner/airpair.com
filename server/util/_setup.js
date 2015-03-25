require('./es6')
var colors = require('colors')

var timestart = new Date().getTime()
var timelast = new Date().getTime()
global.$timelapsed = function(msg) {
  var sublapsed   = (new Date().getTime() - timelast).toString()
  timelast        = new Date().getTime()
  var lapsed      = (timelast-timestart).toString()
  console.log((lapsed+"      a".substring(0,6-lapsed.length)).magenta,
       (sublapsed+"        b".substring(0,8-sublapsed.length)).green,
        msg.magenta)
}

module.exports = {
  colors:         colors,
  initConfig:     require('./config'),
  initGlobals:    require('./globals')
}
