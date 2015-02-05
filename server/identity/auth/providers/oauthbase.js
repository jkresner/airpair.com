var passport = require('passport')
import * as authConfig from './config'


var logging = false


var oauthFn = (provider, scope) => {
  var opts = {
    failureRedirect: `${config.auth.loginUrl}?fail=${provider}`,
    scope: scope
  }

  return (req, res, next) => {
    if (logging) {
			$log('oauthFn.req.isAuthenticated'.white, JSON.stringify(opts))
			$log('oauthFn.req.user', req.user)
    }

    if (opts.assignProperty) delete opts.assignProperty
    if (req.query.scope) opts.scope = req.query.scope.split(',')

    if ( req.isAuthenticated() )
    {
    	if (logging) $log('oauthFn.req.isAuthenticated().true.authorize'.red)

      // If the users is ALREADY logged in (got a session), then we
      // handshake with the provider AND do not do anything with the session
      // * the name authorize is kind of unclear, hence the comments
      passport.authorize(provider, opts)(req, res, next)
    }
    else
    {
    	if (logging) $log('oauthFn.req.isAuthenticated().false.authenticate'.red)

      // If the users is not logged in (got a session), then we
      // handshake with the provider AND authenticate the user
      passport.authenticate(provider, opts)(req, res, next)
    }
  }
}


export function init(provider, Strategy, successfulShakeDelegate) {
  var oauthConfig = authConfig.getEnvConfig(provider)

  var verifyCallback = (req, accessToken, refreshToken, profile, done) =>
  {
    // remove extra repetitive junk from oauth response
    delete profile._raw

    // Save token to db for re-use later
    profile.token = { token: accessToken, attributes: { refreshToken: refreshToken } }

    if (logging) {
      $log(`${provider}.VerifyCallback`, req.user, profile)
    }

    successfulShakeDelegate(req, provider, profile, done)
  }

  passport.use(provider, new Strategy(oauthConfig, verifyCallback))

  return oauthFn(provider, oauthConfig.scope)
}
