var passport = require('passport')
import * as authConfig from './config'

var logging = true

var authFn = (provider) => {
  return (req, res, next) => {
    passport.authenticate(provider, (err, user, info) => {
      if (err) { return next(err) }
      
      if (user) { 
        var url = '/'
        if (req.session && req.session.returnTo)
        {
          url = req.session.returnTo
          delete req.session.returnTo
        }

        req.logIn(user, function(err) {
          if (err) { return next(err) }
          return res.redirect(url)
        })
      }
      else
      {
        res.redirect(`${config.auth.loginUrl}?fail=${provider}&info=${info}`)
      }

    })(req, res, next)
  }
}

export function init(provider, strategyCallback) {
  var Strategy = require(`passport-local`).Strategy 
  var cfg = authConfig.getEnvConfig(provider)

  passport.use(provider, new Strategy(cfg, strategyCallback))

  return authFn(provider)
}
