'use strict';

var setup = require('./server/util/_setup')
var config = setup.initConfig(process.env.env || 'dev')
setup.initGlobals(config)

require('./index').run()
