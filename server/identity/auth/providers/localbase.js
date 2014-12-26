var passport = require('passport')
import * as authConfig from './config'

var logging = false

var authFn = (provider) => {
  return (req, res, next) => {
    passport.authenticate(provider, (err, user, info) => {

      if (err)
      {
        next(err)
      }
      else if (user)
      {
        //-- wipe anonymous data so logging out isn't weird
        req.session.anonData = null

        req.logIn(user, function(eerr) {
          if (eerr) return next(eerr)
          res.json(user)
          res.end()
        })
      }
      else
      {
        // `${config.auth.loginUrl}?fail=${provider}&info=${info}`
        res.status(400).json({ provider: provider, error: info })
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
