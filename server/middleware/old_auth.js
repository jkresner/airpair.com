/*
module.exports = function(app, mw) {

  if (config.auth.test) {
    // config.auth.test.defaultLoginLogic = mw.logic.auth.oauth
    app.post(config.auth.test.loginUrl, config.auth.test.loginHandler)
  }


  var AuthSvc                  = require('../services/auth')
  var {localAuth}              = require('../middleware/auth')


  app.get('/logout', mw.$.authd, mw.$.setReturnTo, mw.auth.logout({track:analytics.event}))


  app.use('/auth',
    app.Router()
      .use(mw.$.setReturnTo)
      // .get('/twitter/callback', mw.$.authd, MW.oauth('twitter'))
      // .get('/bitbucket/callback', mw.$.authd, MW.oauth('bitbucket'))
      // .get('/linkedin/callback', mw.$.authd, MW.oauth('linkedin'))
      // .get('/angellist/callback', mw.$.authd, MW.oauth('angellist'))
      // .get('/stackexchange/callback', mw.$.authd, MW.oauth('stackexchange', require('./passport-so')))
      // .get('/google/callback', mw.$.authd, mw.auth.oauth('google', require('passport-google-oauth').OAuth2Strategy))
      .get('/slack/callback', mw.$.authd, mw.auth.oauth('slack', require('../middleware/passport-slack')))
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
      .use(mw.$.cachedTags)
      .get('/github/callback', mw.auth.oauth('github', require('../middleware/passport-github')))
      .post('/login', localAuth('login', require('passport-local'), AuthSvc.localLogin))
      .post('/signup', localAuth('signup', require('passport-local'), (req, email, password, done) => {
        AuthSvc.localSignup.call(req, email, password, req.body.name, done)
      }))
      .use(mw.auth.admit({redirectUrl:config.auth.defaultRedirectUrl,track:analytics.event}))
    )

}
*/
