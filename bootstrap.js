'use strict';

var setup = require('./server/util/_setup')

setup.colors.APPLOAD = setup.colors.white
setup.colors.UPDATE = setup.colors.yellow
setup.colors.TRACE = setup.colors.gray
setup.colors.VALIDAION = setup.colors.blue
setup.colors.WRAPPERCALL = setup.colors.white
setup.colors.setTheme({
  appload: 'APPLOAD',
  update: 'UPDATE',
  trace: 'TRACE',
  validation: 'VALIDAION',
  wrappercall: 'WRAPPERCALL',
})

var config = setup.initConfig(process.env.env || 'dev')
setup.initGlobals(config)

require('./index').run()
