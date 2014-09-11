var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')  

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
  })  
}