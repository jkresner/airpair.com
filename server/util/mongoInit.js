var mongoose = require('mongoose')

export default {

  connect(callback) {
    mongoose.connect(config.mongoUri)

    var db = mongoose.connection

    db.on('error', (e) => $log(('mongo connection error:' + e).red) )
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
