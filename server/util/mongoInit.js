var mongoose = require('mongoose')
var _s = require('underscore.string')

module.exports = {

  connect(callback) {
    mongoose.connect(config.mongoUri)

    var db = mongoose.connection

    // db.on('error', (e) => {
    //   // $log(('run mongod command before running tests').red) )
    //   $log((`mongo connection: #{e}`).red) )
    // })

    db.once('disconnected', () => {
      $log(('mongo default connection disconnected').red.dim)
    })

    db.once('error', (e) => {
      $log((`mongo connection: ${e}`).red.bold)
      // callback()
    })

    db.once('open', () => {
      $log(`          Connected to db ${config.mongoUri}`.appload)
      callback()
    })

    return db
  },

  initSessionStore(session, callback)
  {
    var MongoStore = require('connect-mongo')(session)

    var sessionStore = new MongoStore({
      autoReconnect: true,
      collection: `v1sessions`,
      url : `${config.mongoUri}`
    })
    callback(sessionStore)
  }

}
