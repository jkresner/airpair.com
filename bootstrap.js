var System = require('es6-module-loader').System;
var initConfig = require('./server/config')
var setGlobals = require('./server/global')

var config = initConfig(process.env.env || 'dev', __dirname)
setGlobals(config)

System.import('./index').then(function(index) {
  
  index.run();

}).catch(function(err){

	console.log('err', err);

});