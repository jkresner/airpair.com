'use strict';

// Compile JS aside from node modules as es6
var traceur = require('traceur')
require('traceur-source-maps').install(traceur)
traceur.require.makeDefault(function (filePath) {
  return !~filePath.indexOf('node_modules')
})

var initConfig = require('./server/util/config')
var config = initConfig(process.env.env || 'dev', __dirname)

var setGlobals = require('./server/util/global')
setGlobals(config)

require('./index').run()