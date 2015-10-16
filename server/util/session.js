var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var passport = require('passport')
var middleware = require('../middleware/auth')
var UserData = require('../services/users.data')
var logging = false

// takes a delegate to initalize a store that could be Mongo / Redis etc.x
module.exports = function(app, initSessionStore, done)
{
  initSessionStore( session, (sessionStore) => {

    // Passport does not directly manage your session, it only uses the session.
    // So you configure session attributes (e.g. life of your session) via express
    var sessionOpts = {
      saveUninitialized: true, // saved new sessions
      resave: false, // do not automatically write to the session store
      store: sessionStore,
      secret: config.session.secret,
      cookie : { httpOnly: true, maxAge: 2419200000 },
      name: 'aps'
    }

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cookieParser(config.session.secret))

    var normalSession = session(sessionOpts)
    app.use(middleware.checkToPersistSession(normalSession))

    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser( (user, done) => {
      // The user object comes from UserService.upsertSmart
      var sessionUser = UserData.select.sessionFromUser(user)
      if (logging) $log('serializeUser', sessionUser)
      done(null, sessionUser)
    })

    passport.deserializeUser( (sessionUser, done) => {
      // The sessionUser object is different from the user mongoose collection
      // it's actually req.session.passport.user and comes from the session collection
      if (logging) $log('deserializeUser', sessionUser.email)
      done(null, sessionUser)
    })


    global.MW = { oauth: function(provider, Strategy) {
      if (!Strategy) Strategy = require(`passport-${provider}`).Strategy

      var success = (req, token, refresh, resp, cb) => {
        $log('resp', resp)
        require('../services/auth').link.call(req, provider, resp._json, {token,refresh}, cb)
      }

      config.auth[provider].passReqToCallback = true
      passport.use(provider, new Strategy(config.auth[provider], success))

      return function(req, res, next) {
        var opts = {}

        // if (opts.assignProperty) delete opts.assignProperty

        // If the users is ALREADY logged in (got a session), then we
        // handshake with the provider AND do not do anything with the session
        // * the name authorize is kind of unclear, hence the comments
        var passMethod = req.isAuthenticated() ? 'authorize' : 'authenticate'

        $log(`passport:${passMethod} ${provider}`.white, opts)
        passport[passMethod](provider, opts)(req, res, next)
      }
    }}


    done()
  })
}
