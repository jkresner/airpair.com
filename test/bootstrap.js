//-- Runs the site against the test database
//-- Helpful for manually testing things like oauth

var setup = require('../server/util/_setup')
var config = setup.initConfig('test')
setup.initGlobals(config)

require('../server/app').run(config)
