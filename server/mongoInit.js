var mongoose = require('mongoose')

export function connect() {

  mongoose.connect(config.mongoUri)

  var db = mongoose.connection
  
  db.on('error', (e) => $log('mongo connection error:' + e) )
  db.once('open', () => $log(`connected to db ${config.mongoUri}`) )

  return db
}


export function initSessionStore(session, callback) 
{
  var MongoStore = require('connect-mongo')(session)

  var sessionStore = new MongoStore({ 
    auto_reconnect: true,
    url : `${config.mongoUri}/v1sessions` 
  })

  callback(sessionStore)
}