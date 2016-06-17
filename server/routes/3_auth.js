module.exports = function(app, mw) {

  app
    .use(/\/auth\/((twitter)|(bitbucket)|(linkedin)|(angellist)|(stackexchange)|(google)|(slack))$/, mw.$.authd)
    .get('/login', mw.$.noBot, mw.$.session, mw.$.reqFirst, mw.$.clientPage)


  // app.routers['auth']
    // .get('/login', mw.$.noBot, mw.$.session, mw.$.reqFirst, mw.$.clientPage)

    // .get('/twitter/callback', mw.$.authd, MW.oauth('twitter'))
    // .get('/bitbucket/callback', mw.$.authd, MW.oauth('bitbucket'))
    // .get('/linkedin/callback', mw.$.authd, MW.oauth('linkedin'))
    // .get('/angellist/callback', mw.$.authd, MW.oauth('angellist'))
    // .get('/stackexchange/callback', mw.$.authd, MW.oauth('stackexchange', require('./passport-so')))
    // .get('/google/callback', mw.$.authd, mw.auth.oauth('google', require('passport-google-oauth').OAuth2Strategy))
    // .get('/slack/callback', mw.$.authd, mw.auth.oauth('slack', require('../middleware/passport-slack')))


//   var {localAuth}              = require('../middleware/auth')
//       .post('/password-reset', (req, res, next) => {
//         var validation = require("../../shared/validation/users")
//         var inValid = validation.requestPasswordChange(req.user, req.body.email)
//         if (inValid) return res.status(403).json({message:inValid})
//         AuthSvc.passwordReset,req)(req.body.email, (e,r) => {
//           if (e) { e.fromApi = true; return next(e) }
//           res.json(r)
//         })
//       })
//       .post('/password-set', (req, res, next) => {
//         var {email, hash, password} = req.body
//         var validation = require("../../shared/validation/users")
//         var inValid = validation.changePassword(req.user, email, hash, password)
//         if (inValid) return res.status(403).json({message:inValid})
//         AuthSvc.changePassword.call(req, email, hash, password, (e,r) => {
//           if (e) { e.fromApi = true; return next(e) }
//           AuthSvc.localLogin.call(req, email, password, (e,r,info) => {
//             if (e||info) return next(e||info)
//             req.login(r, (err) => {
//               if (err) return next(err)
//               res.json(r)
//             })
//           })
//         })
//       })
//       .get('/github/callback', mw.auth.oauth('github', require('../middleware/passport-github')))
//       .post('/login', localAuth('login', require('passport-local'), AuthSvc.localLogin))
//       .post('/signup', localAuth('signup', require('passport-local'), (req, email, password, done) => {
//         AuthSvc.localSignup.call(req, email, password, req.body.name, done)
//       }))
//       .use(mw.auth.admit({redirectUrl:config.auth.defaultRedirectUrl,track:analytics.event}))
//     )

  // localAuth(authType, Strategy, success) {
  //   var strategy = new Strategy(config.auth.local, success)
  //   passport.use(authType, strategy)

  //   return (req, res, next) => {
  //     passport.authenticate(authType, (err, user, info) => {
  //       if (err || info)
  //       {
  //         if (!err && info) err = Error(info.message)
  //         else if (!err && !user) err = Error(`No user found with email ${req.body.email}`)
  //         err.fromApi = true
  //         next(err)
  //       }
  //       else if (user)
  //       {
  //         //-- wipe anonymous data so logging out isn't weird
  //         req.session.anonData = null

  //         req.logIn(user, function(eerr) {
  //           if (eerr) return next(eerr)
  //           res.json(user)
  //           // console.log('in authFn > ', next)
  //           // if (next)
  //           //   next();
  //           // else
  //           res.end() // -- need to end response or triggers 404 middleware
  //         })
  //       }

  //     })(req, res, next)
  //   }
  // },


  // handleOAuthSuccess(providerName, svcName, fnName) {
  //   return (req, res, next) => {
  //     if (logging) $log(`mw.handleOAuthSuccess ${req.authInfo.userinfo}`.cyan)
  //     var {userinfo,tokeninfo} = req.authInfo
  //     var svc = require(`../services/${svcName}`)
  //     svc[fnName].call({user:req.user}, providerName, userinfo, tokeninfo, (e,r) => {
  //       var redirectQuery = "success=true"
  //       if (e) {
  //         $log('handleOAuthSucces.error: '.red, e)
  //         redirectQuery = `fail=${e.message||e.toString()}`
  //       }

  //       delete req.session.doneOAuthReturnToUrl
  //       res.redirect(`${req.session.returnTo}?${redirectQuery}`)
  //       res.end()
  //     })
  //   }
  // }


}
