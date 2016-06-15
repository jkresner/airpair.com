"""
  coffee --nodejs "--harmony_destructuring" cmd/tools/detective/run.coffee
"""


SCREAM =                     require('meanair-scream')
# MA                           = require('meanair-server')
meanair = util               : require('meanair-shared').TypesUtil
global.idToDate              = (id) => "#{meanair.util.BSONID.toDate(id)}".white
global.idToMoment            = meanair.util.BSONID.toMoment
global.$log                  = console.log

SCREAM({app:'empty'}).run()
