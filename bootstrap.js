'use strict';

var setup = require('./server/util/_setup')

setup.colors.APPLOAD = setup.colors.white
setup.colors.setTheme({ appload: 'APPLOAD'})

var config = setup.initConfig(process.env.env || 'dev')
setup.initGlobals(config)

require('./index').run()
