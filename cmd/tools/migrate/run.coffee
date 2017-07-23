# coffee cmd/tools/migrate/run.coffee -c migrate

colors                       = require('colors')
global.$log                  = console.log
# global.idToDate              = util.MongoUtil.idToDate
# global.idToMoment            = util.MongoUtil.idToMoment



global.specInit = (ctx) ->
  # ctx.timeout(4000000)
  before ->
    global.JSONSTRING = {}
    global.Templates = DB.Collections.templates
    global.Redirects = DB.Collections.redirects

  after ->
    delete global.JSONSTRING

config          =
  mongoUrl: 'mongodb://localhost/airpair_dev'


SCREAM                       = require('screamjs')


SCREAM(__dirname).run (done) ->
  done({config})
