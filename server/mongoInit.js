var mongoose = require('mongoose')

export function connect() {

  mongoose.connect(config.mongoUri)

  var db = mongoose.connection
  
  db.on('error', (e) => $log('mongo connection error:' + e) )
  db.once('open', () => $log(`connected to db ${config.mongoUri}`) )

  return db
}

export function setSessionStore(express, app, store) {

  // MongoSessionStore = require('connect-mongo')(express)
  // storeOptions = url: "#{config.mongoUri}/sessions", auto_reconnect: true

 //  app.use express.session({
 //   cookie : { path: '/', httpOnly: true, maxAge: 2419200000 },
 //   secret: 'airpairawesome',
 //   store: mongoStore
 //  })

}