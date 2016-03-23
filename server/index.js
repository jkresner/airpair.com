var MAServer  = require('meanair-server')
var config    = MAServer.Config(__dirname, process.env.ENV || 'dev', true)

var {initGlobals} = require('./util/_setup')
initGlobals(config)

require('./app').run(config, {
  MAServer,
  tracking: require('./app.track'),
  done: e => e ? $log('APP.ERROR'.red, e) : ''
})
