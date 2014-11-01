var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var passport = require('passport')

var logging = true


// takes a delegate to initalize a store that could be Mongo / Redis etc.
export default function(app, initSessionStore)
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
    app.use(session(sessionOpts))

    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser( (user, done) => {
      // The user object comes from UserService.upsertSmart
      var sessionUser = { _id: user._id, name: user.name, emailVerified: user.emailVerified, email: user.email, roles: user.roles }
      if (logging) $log('serializeUser', sessionUser)
      done(null, sessionUser)
    })

    passport.deserializeUser( (sessionUser, done) => {
      // The sessionUser object is different from the user mongoose collection
      // it's actually req.session.passport.user and comes from the session collection
      if (logging) $log('deserializeUser', sessionUser.email)
      done(null, sessionUser)
    })

  })
}
