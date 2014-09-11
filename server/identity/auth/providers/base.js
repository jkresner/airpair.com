var passport = require('passport')

var logging = false

export function getEnvConfig(provider) {
  return {
    passReqToCallback: true,
    callbackURL: `${config.oAuth.callbackHost}/auth/v1/${provider}/callback`, 
    clientID: config.oAuth[provider].clientID,
    clientSecret: config.oAuth[provider].clientSecret,
    scope: config.oAuth[provider].scope
  }
}

export var shakeFn = (provider, scope) => {
  var opts = {
    failureRedirect: `${config.auth.loginUrl}?fail=${provider}`,
    scope: scope
  }

  return (req, res, next) => {
    if ( req.isAuthenticated() )
    {
      // If the users is ALREADY logged in (got a session), then we
      // handshake with the provider AND do not do anything with the session
      // * the name authorize is kind of unclear, hence the comments      
      passport.authorize(provider, opts)(req, res, next)
    }
    else
    {
      // If the users is not logged in (got a session), then we
      // handshake with the provider AND authenticate the user
      opts.successReturnToOrRedirect = '/'
      passport.authenticate(provider, opts)(req, res, next)
    }
  }
}

export function init(provider, successfulShakeDelegate) {
  var Strategy = require(`passport-${provider}-oauth`).OAuth2Strategy
  var oauthConfig = getEnvConfig(provider);

  var verifyCallback = (req, accessToken, refreshToken, profile, done) =>
  {
    // remove extra repetitive junk from oauth response
    delete profile._raw 

    // Save token to db for re-use later
    profile.token = { token: accessToken, attributes: { refreshToken: refreshToken } }
    
    if (logging)
      $log(`${provider}.VerifyCallback`, req.user, profile)
    
    successfulShakeDelegate(req, provider, profile, done)
  }

  passport.use(provider, new Strategy(oauthConfig, verifyCallback))

  return shakeFn(provider, oauthConfig.scope)
}

