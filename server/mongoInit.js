var mongoose = require('mongoose')

export function connect()
{
  mongoose.connect(config.mongoUri)

  var db = mongoose.connection

  db.on('error', (e) => $log(('mongo connection error:' + e).red) )
  db.once('open', () => $log(`connected to db ${config.mongoUri}`.white) )

  return db
}


export function initSessionStore(session, callback)
{
  var MongoStore = require('connect-mongo')(session)

  // we'd want to wrap the connect-mongo store or something in production
  var fn = MongoStore.prototype.set;
  MongoStore.prototype.set = function(sid, session, callback) {
    if (session.bot && session.bot == 'true') return callback()
    fn.call(this, sid, session, callback)
  }

  var sessionStore = new MongoStore({
    auto_reconnect: true,
    url : `${config.mongoUri}/v1sessions`
  })

  callback(sessionStore)
}
