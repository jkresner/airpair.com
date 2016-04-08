module.exports = function(app, mw, {ads}) {

// if (config.auth.test) {
//     // config.auth.test.defaultLoginLogic = mw.logic.auth.oauth
//     app.post(config.auth.test.loginUrl, config.auth.test.loginHandler)
//   }


//   var AuthSvc                  = require('../services/auth')
//   var {localAuth}              = require('../middleware/auth')


//   app.get('/logout', mw.$.authd, mw.$.setReturnTo, mw.auth.logout({track:analytics.event}))


//   app.use('/auth',
//     app.Router()
//       .use(mw.$.setReturnTo)
//       // .get('/twitter/callback', mw.$.authd, MW.oauth('twitter'))
//       // .get('/bitbucket/callback', mw.$.authd, MW.oauth('bitbucket'))
//       // .get('/linkedin/callback', mw.$.authd, MW.oauth('linkedin'))
//       // .get('/angellist/callback', mw.$.authd, MW.oauth('angellist'))
//       // .get('/stackexchange/callback', mw.$.authd, MW.oauth('stackexchange', require('./passport-so')))
//       // .get('/google/callback', mw.$.authd, mw.auth.oauth('google', require('passport-google-oauth').OAuth2Strategy))
//       .get('/slack/callback', mw.$.authd, mw.auth.oauth('slack', require('../middleware/passport-slack')))
//       .post('/password-reset', (req, res, next) => {
//         var validation = require("../../shared/validation/users")
//         var inValid = validation.requestPasswordChange(req.user, req.body.email)
//         if (inValid) return res.status(403).json({message:inValid})
//         $callSvc(AuthSvc.passwordReset,req)(req.body.email, (e,r) => {
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
//       .use(mw.$.cachedTags)
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


  // showAuthdPageViews() {
  //   return function(req, res, next) {

  //     if (req.isAuthenticated()) {
  //       var ref = req.header('Referer')
  //       var refStr = (ref ? (` <<< `.cyan+`${ref}`.replace(/\/+$/, '').blue) : '')
  //         .replace('https://','').replace('http://','').replace('www.','')

  //       if (req.originalUrl.indexOf('/api') == -1)
  //         $log(req.user.name.gray+`\t\t${req.originalUrl}`.cyan, refStr)
  //     }
  //     next()
  //   }
  // },

  // checkToPersistSession(expressSession) {
    // return (req, res, next) => {
      // if (logging) $log(`mw.checkToPersistSession ${req.url} ${!isBot(req.get('user-agent'))}`.cyan)
      // if (isBot(req.get('user-agent'), BOTS.all) || req.nonSessionUrl) {
        // req.session = {}
        // req.sessionID = 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' //-- hard coded consistent uid
        // return next() //-- Do not track the session
      // }
      // return expressSession(req, res, next)
    // }
  // },

  // setAppUrlRegexList(app) {
  //   app.routeRegexps = []
  //   for (var stack of app._router.stack) {
  //     if (stack.route && !stack.regexp.fast_slash)
  //       app.routeRegexps.push(stack.regexp)
  //     else if (stack.name == 'router') {
  //       if (!stack.regexp.fast_slash) {
  //         app.routeRegexps.push(stack.regexp)
  //       }
  //       for (var rstack of stack.handle.stack)
  //       {
  //         if (!rstack.regexp.fast_slash)
  //           app.routeRegexps.push(rstack.regexp)
  //       }
  //     }
  //   }
  //   app.routeRegexps.splice(-1,1) //-- /^\/(?:([^\/]+?))\/?$/i  (don't include catch all route)
  //   if (logging) $log(`setAppUrlRegexList`.cyan, app.routeRegexps.length)
  // },

  // setUrlMatch(app) {
  //   return function(req, res, next) {
  //     if (logging) $log(`setUrlMatch ${req.url}`.cyan, req.url, req.originalUrl)
  //     var url = req.originalUrl.split('?')[0]
  //     for (var regexp of app.routeRegexps)
  //     {
  //       var match = regexp.test(url)
  //       if (match) {
  //         req.urlMatch = true
  //         $log(regexp , req.urlMatch, url)
  //         return next()
  //       }
  //     }
  //     next()
  //   }
  // },

  // setNonSessionUrl() {
  //   return function(req, res, next) {
  //     if (logging) $log(`setNonSessionUrl ${req.url}`.cyan, req.originalUrl)
  //     var nonSessionUrls = [
  //       '/feed',
  //       '/android/rss',
  //       '/rails/consulting',
  //       '/static/styles/'
  //     ]

  //     for (var url of nonSessionUrls)
  //       if (req.originalUrl.indexOf(url) == 0)
  //         req.nonSessionUrl = true

  //     if (req.type == "HEAD")
  //       req.nonSessionUrl = true

  //     next()
  //   }
  // },


  // authdRedirect(toUrl,statusCode) {
  //   return (req, res, next) => {
  //     if (logging) $log(`mw.authdRedirect ${req.isAuthenticated()}`.cyan)
  //     if (!req.isAuthenticated()) return next()
  //     else
  //     {
  //       res.redirect(statusCode||302, toUrl)
  //       res.end()
  //     }
  //   }
  // },


  // authAlreadyDone(req, res, next) {
  //   if (logging) $log(`mw.authAlreadyDone ${req.isAuthenticated()}`.cyan)
  //   if (req.isAuthenticated()) { $log('authAlreadyDONE'.red); middleware.authDone(req, res, next) }
  //   else { next() }
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
