var cfg = {
  mongoUri: process.env.MONGOHQ_URL || "mongodb://localhost/airpair_dev",
  session: { secret: 'airyv1' },
  auth: {
    loginUrl: '/v1/auth/login',
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

// Temporary hack
// -------------------------
cfg.local = process.env.MONGOHQ_URL == null

if (!cfg.local) {
  cfg.auth.oAuth.callbackHost = process.env.AUTH_OAUTH_CALLBACKHOST
  cfg.auth.google.clientID = process.env.AUTH_GOOGLE_CLIENTID
  cfg.auth.google.clientSecret = process.env.AUTH_GOOGLE_CLIENTSECRET
}

// -------------------------

export default cfg