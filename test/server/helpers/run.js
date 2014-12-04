//-- Runs the site against the test database
//-- Helpful for manually testing things like oauth

var traceur = require('traceur')
require('traceur-source-maps').install(traceur)
traceur.require.makeDefault(function (filePath) {
  return !~filePath.indexOf('node_modules')
})

var setGlobals = require('./../../../server/util/global')
var initConfig = require('./../../../server/util/config')
var config = initConfig('test', __dirname.replace('/test/server/helpers','').replace('\\test\\server\\helpers',''))
config.mailProvider = { send: function() {} }
setGlobals(config)

global.app = require('../../../index').run()
