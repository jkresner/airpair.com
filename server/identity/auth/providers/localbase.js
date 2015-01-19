var passport = require('passport')
import * as authConfig from './config'

var logging = false

var authFn = (provider) => {
  return (req, res, next) => {
    passport.authenticate(provider, (err, user, info) => {

      if (err || info)
      {
        if (!err && info) err = Error(info)
        else if (!err && !user) err = Error(`No user found with email ${req.body.email}`)
        err.fromApi = true
        next(err)
      }
      else if (user)
      {
        //-- wipe anonymous data so logging out isn't weird
        req.session.anonData = null

        req.logIn(user, function(eerr) {
          if (eerr) return next(eerr)
          res.json(user)
          // console.log('in authFn > ', next)
          if (next)
            next();
          else
            res.end()
        })
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
