"""
  coffee --nodejs "--harmony_destructuring" cmd/migrate/201606/run.coffee -c local
  coffee --nodejs "--harmony_destructuring" cmd/migrate/201606/run.coffee -c local2
"""

SCREAM =                     require('meanair-scream')

MA                           = require('meanair-server')
meanair = util               : require('meanair-shared').TypesUtil
global.idToDate              = meanair.util.BSONID.toDate
global.idToMoment            = meanair.util.BSONID.toMoment
global.$log                  = console.log



SCREAM().run()
