var passport = require('passport')
import * as authConfig from './config'


var logging = true


var oauthFn = (provider, scope) => {
  var opts = {
    failureRedirect: `${config.auth.loginUrl}?fail=${provider}`,
    scope: scope
  }

  return (req, res, next) => {
    if (logging) $log('oauthFn.req.isAuthenticated', req.isAuthenticated)

    if ( req.isAuthenticated() )
    {
    	if (logging) $log('oauthFn.req.isAuthenticated().true', req.user)

      // If the users is ALREADY logged in (got a session), then we
      // handshake with the provider AND do not do anything with the session
      // * the name authorize is kind of unclear, hence the comments
      passport.authorize(provider, opts)(req, res, next)
    }
    else
    {
    	if (logging) $log('oauthFn.req.isAuthenticated().false')

      // If the users is not logged in (got a session), then we
      // handshake with the provider AND authenticate the user
      passport.authenticate(provider, opts)(req, res, next)
    }
  }
}


export function init(provider, successfulShakeDelegate) {
  var Strategy = require(`passport-${provider}-oauth`).OAuth2Strategy
  var cfg = authConfig.getEnvConfig(provider)

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

  passport.use(provider, new Strategy(cfg, verifyCallback))

  return oauthFn(provider, authConfig.scope)
}

