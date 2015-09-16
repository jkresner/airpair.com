var passport = require('passport')
var authConfig = require('./config')

var logging = false

var authFn = (provider) => {
  return (req, res, next) => {
    passport.authenticate(provider, (err, user, info) => {

      if (err || info)
      {
        if (!err && info) err = Error(info.message)
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
          // if (next)
          //   next();
          // else
          res.end() // -- need to end response or triggers 404 middleware
        })
      }

    })(req, res, next)
  }
}

function init(provider, strategyCallback) {
  var Strategy = require(`passport-local`).Strategy
  var cfg = authConfig.getEnvConfig(provider)

  passport.use(provider, new Strategy(cfg, strategyCallback))

  return authFn(provider)
}


module.exports = { init }
