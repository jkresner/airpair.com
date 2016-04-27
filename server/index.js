// process.env.ENV = 'prod'
var MAServer    = require('meanair-server')
var config      = MAServer.Config(__dirname, process.env.ENV || 'dev', true)
var tracking    = require('./app.track')

console.log('config', config)

config.routes.redirects.on = true

require('./app').run({ config, MAServer, tracking },
    e => e ? $log('APP.ERROR'.red, e) : '')



