var cfg = {
  build:  { version: '1.03', deployed: 'Sep 19' },
  port:     process.env.PORT || 3333,
  mongoUri: process.env.MONGOHQ_URL || "mongodb://localhost/airpair_dev",
  session: { secret: 'airyv1' },
  auth: {
    loginUrl: '/v1/auth/login',
    unauthorizedUrl: '/v1/auth/unauthorized',    
    defaultRedirectUrl: '/v1',
    oAuth: { callbackHost: 'http://localhost:3333' },
    local: {
      usernameField : 'email',
      passwordField : 'password'
    },
    google: {
      clientID: '1019727294613-rjf83l9dl3rqb5courtokvdadaj2dlk5.apps.googleusercontent.com',
      clientSecret: 'Kd6ceFORVbABH7p5UbKURexZ',
      scope: [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ]
    }  
  }
}

module.exports = function(env, appdir) {
  cfg.env = env
  cfg.appdir = appdir
  cfg.livereload = cfg.env == 'dev'

  if (cfg.env == 'test') {
    cfg.port = 4444
    cfg.mongoUri = "mongodb://localhost/airpair_test"
    cfg.testlogin = true
  }

  if (cfg.env == 'staging' || cfg.env == 'production') {
    cfg.auth.oAuth.callbackHost = process.env.AUTH_OAUTH_CALLBACKHOST
    cfg.auth.google.clientID = process.env.AUTH_GOOGLE_CLIENTID
    cfg.auth.google.clientSecret = process.env.AUTH_GOOGLE_CLIENTSECRET
  }

  return cfg;
}