"""
  1) Update local mongo copy
  2) Set the checkKey in the /specs/merge file to look up the users to merge
  coffee --nodejs "--harmony_destructuring" cmd/tools/merger/run.coffee
"""

SCREAM                       = require('meanair-scream')
setup                        = require('../../../server/util/_setup')
setup.colors.APPLOAD         = setup.colors.white
setup.colors.setTheme({appload: 'APPLOAD'})
meanair = util               : require('meanair-shared').TypesUtil
global.domain                = require('domain')
global.idToDate              = meanair.util.BSONID.toDate
global.idToMoment            = meanair.util.BSONID.toMoment


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



cmd = SCREAM.Commander [
  { flag: "-n, --fullname '<fullname>'", help: 'Full name with underscore instead of spaces' }
  { flag: "-e, --emails '<emails>'", help: 'Comma separated emails' }
  { flag: "-p, --liverun", help: 'Send live emails' }
]


run = (mongoUrl, mailTransport) ->
  global.config                = setup.initConfig('prod')
  config.model.mongoUrl        = screamconfig.mongo.url
  config.analytics.on          = false
  config.mail.transport        = mailTransport if mailTransport
  setup.initGlobals(config)
  SCREAM(__dirname, config, {cmd:cmd}).run()

localConfig = ->
  global.screamconfig          = require('./local.json')
  global.dupName               = cmd.fullname.replace(/_/g,' ') if cmd.fullname
  global.dupEmails             = cmd.emails.split(',') if cmd.emails
  run screamconfig.mongo.url


prodConfig = ->
  global.screamconfig          = require('./prod.json')
  mailman                      =
  prodMail =
    default: 'smtp'
    smtp:
      service: 'Gmail',
      auth: { user: 'team@airpair.com', pass: 'UX6BbgZg' }
  run screamconfig.mongo.url, prodMail


if (cmd.liverun)
  prodConfig()
else # if (cmd.name || cmd.emails || cmd.devmerge)
  localConfig()





