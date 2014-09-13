var passport = require('passport')
import * as authConfig from './config'

var logging = true

var authFn = (provider) => {
  return (req, res, next) => {
    passport.authenticate(provider, (err, user, info) => {
      
      if (err) 
      { 
        next(err) 
      }
      else if (user) 
      { 
        req.logIn(user, function(err) { next(err) })
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
