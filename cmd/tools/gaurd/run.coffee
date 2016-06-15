"""
  coffee --nodejs "--harmony_destructuring" cmd/tools/gaurd/run.coffee -o issues
  coffee --nodejs "--harmony_destructuring" cmd/tools/gaurd/run.coffee -o block
"""


SCREAM =                     require('meanair-scream')
meanair = util               : require('meanair-shared').TypesUtil
global.idToDate              = (id) => "#{meanair.util.BSONID.toDate(id)}".white
global.idToMoment            = meanair.util.BSONID.toMoment
global.select                = meanair.util.Object.select
global.$log                  = console.log
global.$logIt                = (op, url, data) => console.log(url.yellow, "#{data}".gray)
global.config                = require('../../../server/app.json')


SCREAM({app:'empty'}).run()
