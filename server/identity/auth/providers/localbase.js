var passport = require('passport')
import * as authConfig from './config'

var logging = true

var authFn = (provider) => {
  return (req, res, next) => {
    passport.authenticate(provider, (err, user, info) => {
      if (err) { return next(err); }
      
      var url = '/';
      if (user) { 
        if (req.session && req.session.returnTo) {
          url = req.session.returnTo;
          delete req.session.returnTo;
        }
      }
      else
      {
        url = `${config.auth.loginUrl}?fail=${provider}&info=${info}`
      }
      res.redirect(url)
      next()

    })(req, res, next)
  }
}

export function init(provider, strategyCallback) {
  var Strategy = require(`passport-local`).Strategy 
  var cfg = authConfig.getEnvConfig(provider)

  passport.use(provider, new Strategy(cfg, strategyCallback))

  return authFn(provider)
}
