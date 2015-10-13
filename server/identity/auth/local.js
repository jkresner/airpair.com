var AuthService   = require('../../services/auth')
var passport = require('passport')
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
  var cfg = config.auth.local
  cfg.passReqToCallback = true

  passport.use(provider, new Strategy(cfg, strategyCallback))

  return authFn(provider)
}


module.exports = {

  login:  init('local-login', (req, email, password, done) => {
    $callSvc(AuthService.localLogin,req)(email, password, done)
  }),

  signup: init('local-singup', (req, email, password, done) => {
    $callSvc(AuthService.localSignup,req)(email, password, req.body.name, done)
  })

}
