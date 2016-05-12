"""
  coffee --nodejs "--harmony_destructuring" cmd/migrate/201605/run.coffee
"""

cmd    = { config: "local.json"}
app    = 'empty'
SCREAM =                     require('meanair-scream')(__dirname, {cmd,app})

MA                           = require('meanair-server')
meanair = util               : require('meanair-shared').TypesUtil
global.idToDate              = meanair.util.BSONID.toDate
global.idToMoment            = meanair.util.BSONID.toMoment
global.$log                  = console.log


global.specInit = (ctx) ->
  ctx.timeout(4000000)
  before ->
    global.Users = DB.Collections.users
    global.Posts = DB.Collections.posts
    global.History = []
    for snap of DB.Collections
      if (snap!='posts' && snap!='users')
        global.History.push(DB.Collections[snap])
        # console.log('DB.Collections', snap)


SCREAM.run()
