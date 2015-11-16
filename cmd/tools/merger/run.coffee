"""
  1) Update local mongo copy
  2) Set the checkKey in the /specs/merge file to look up the users to merge
  coffee --nodejs "--harmony_destructuring" cmd/tools/merger/run.coffee
"""


setup                        = require('../../../server/util/_setup')
setup.colors.APPLOAD         = setup.colors.white
setup.colors.setTheme({appload: 'APPLOAD'})
global.config                = setup.initConfig('prod')
config.analytics.on          = false
# config.mongoUrl              = 'mongodb://localhost/airpair_dev'


config.mongoUrl              = 'mongodb://heroku:'
config.mail.transport =
  default: 'smtp'
  smtp:
    service: 'Gmail',
    auth: { user: 'team@airpair.com', pass: 'UX6BbgZg' }


setup.initGlobals(config)
meanair = util               : require('meanair-shared.util')
global.domain                = require('domain')
global.idToDate              = meanair.util.MongoUtil.idToDate
global.idToMoment            = meanair.util.MongoUtil.idToMoment


global.specInit = (ctx) ->
  ctx.timeout(4000000)
  before ->
    global.Tags = DB.Collections.tags
    global.Users = DB.Collections.users
    global.Experts = DB.Collections.experts
    global.Bookings = DB.Collections.bookings
    global.Requests = DB.Collections.requests
    global.Orders = DB.Collections.orders
    global.Posts = DB.Collections.posts
    global.Paymethods = DB.Collections.paymethods
    global.Payouts = DB.Collections.payouts
    global.Templates = DB.Collections.templates
    global.mailman = require('../../../server/util/mailman')()


SCREAM          = require('meanair-scream')



SCREAM(__dirname, config).run()
