//-- Runs the site against the test database
//-- Helpful for manually testing things like oauth

var traceur = require('traceur')
require('traceur-source-maps').install(traceur)
traceur.require.makeDefault(function (filePath) {
  return !~filePath.indexOf('node_modules')
})

var initConfig = require('./../../../server/util/config')
var config = initConfig('test', __dirname.replace('/test/server/helpers',''))
var setGlobals = require('./../../../server/util/global')
setGlobals(config)

global.app = require('../../../index').run()
