'use strict';

// Traceur will compile all JS aside from node modules
var Traceur = require('traceur');
Traceur.require.makeDefault(function(filename) {
  return !(/node_modules/.test(filename));
});

var initConfig = require('./server/config')
var setGlobals = require('./server/global')

var config = initConfig(process.env.env || 'dev', __dirname)
setGlobals(config)

require('./index').run()