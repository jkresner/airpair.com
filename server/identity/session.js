var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')  
var passport = require('passport')

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

    // if (config.env is 'test')
    //   require('./app_test')(app)
    // else
      app.use(passport.initialize())
    app.use(passport.session())
  
    passport.serializeUser( (user, done) => {
      // The user object we get here is from findOneAndUpdate in UserService.upsert
      var session = { _id: user._id }
      $log('serializeUser', session)
      done( null, session )
    })

    passport.deserializeUser( (user, done) => {
      // note the user object here is different from the user mongoose collection
      // it's actually req.session.passport.user
      $log('deserializeUser', user)
      done(null, session)
    })

  })  
}