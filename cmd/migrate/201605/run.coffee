"""
  coffee --nodejs "--harmony_destructuring" cmd/tools/migrate/201605/run.coffee
"""

cmd    = { config: "local.json"}
app    = 'empty'
SCREAM =                     require('meanair-scream')(__dirname, {cmd,app})

# MA                           = require('meanair-server')
# global.domain                = require('domain')
meanair = util               : require('meanair-shared').TypesUtil
global.idToDate              = meanair.util.BSONID.toDate
global.idToMoment            = meanair.util.BSONID.toMoment


global.specInit = (ctx) ->
  ctx.timeout(4000000)
  before ->
    global.Posts = DB.Collections.posts
    global.History = []
    for snap of DB.Collections
      if (snap!='posts')
        global.History.push(DB.Collections[snap])
        # console.log('DB.Collections', snap)

# global.screamconfig          = require('./local.json')
# global.config                = MA.Config(appRoot, 'test', true)
# console.log('run'.white, config.mongoUrl, appRoot)
SCREAM.run()
