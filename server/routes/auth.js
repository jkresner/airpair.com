var AuthSvc                  = require('../services/auth')
var mw                       = require('../middleware/auth')
var Router                   = require('express').Router
var passport                 = require('passport')


var routes = {

connect: Router()
  .use(mw.setReturnTo)

  .post('/login', mw.localAuth(passport, 'login', (req, email, password, done) =>
    AuthSvc.localLogin.call(req, email, password, done)))
  .post('/signup', mw.localAuth(passport, 'signup', (req, email, password, done) =>
    AuthSvc.localSignup.call(req, email, password, req.body.name, done)))

  .get('/github/callback', MW.oauth('github', require('./passport-github')))
  .get('/google/callback', MW.oauth('google', require('passport-google-oauth').OAuth2Strategy))
  .get('/twitter/callback', mw.authd, MW.oauth('twitter'))
  .get('/bitbucket/callback', mw.authd, MW.oauth('bitbucket'))
  .get('/linkedin/callback', mw.authd, MW.oauth('linkedin'))
  .get('/angellist/callback', mw.authd, MW.oauth('angellist'))
  .get('/slack/callback', mw.authd, MW.oauth('slack', require('./passport-slack')))
  .get('/stackexchange/callback', mw.authd, MW.oauth('stackexchange', require('./passport-so')))
  .post('/password-reset', (req, res, next) => {
    var validation = require("../../shared/validation/users")
    var inValid = validation.requestPasswordChange(req.user, req.body.email)
    if (inValid) return res.status(403).json({message:inValid})
    $callSvc(AuthSvc.passwordReset,req)(req.body.email, (e,r) => {
      if (e) { e.fromApi = true; return next(e) }
      res.json(r)
    })
  })
  .post('/password-set', (req, res, next) => {
    var {email, hash, password} = req.body
    var validation = require("../../shared/validation/users")
    var inValid = validation.changePassword(req.user, email, hash, password)
    if (inValid) return res.status(403).json({message:inValid})
    AuthSvc.changePassword.call(req, email, hash, password, (e,r) => {
      if (e) { e.fromApi = true; return next(e) }
      AuthSvc.localLogin.call(req, email, password, (e,r,info) => {
        if (e||info) return next(e||info)
        req.login(r, (err) => {
          if (err) return next(err)
          res.json(r)
        })
      })
    })
  })

  .use(mw.authDone)

}


module.exports = function(app) {

  if (config.auth.test) {
    // config.auth.test.defaultLoginLogic = mw.logic.auth.link
    app.post(config.auth.test.loginUrl, config.auth.test.loginHandler)
  }

  app.get('/logout', mw.setReturnTo, (req, res, next) => {
    if (req.user) analytics.event('logout', req.user, {})
    req.logout()
    res.redirect(config.auth.loginUrl)
  })

  app.use('/auth', routes.connect)

}
