var logging                = false
var {isBot,stringToJson}   = util

var setSessionVarFromQuery = (varName) =>
  (req, res, next) => {
    var reqVar = req.query[varName]
    if (reqVar) {
      req.session[varName] = reqVar
      if (logging) { $log(`req.session.${varName}`, reqVar) }
    }
    next()
  }


var middleware = {

  setAppUrlRegexList(app) {
    app.routeRegexps = []
    for (var stack of app._router.stack) {
      if (stack.route && !stack.regexp.fast_slash)
        app.routeRegexps.push(stack.regexp)
      else if (stack.name == 'router') {
        if (!stack.regexp.fast_slash) {
          app.routeRegexps.push(stack.regexp)
        }
        for (var rstack of stack.handle.stack)
        {
          if (!rstack.regexp.fast_slash)
            app.routeRegexps.push(rstack.regexp)
        }
      }
    }
  },

  setUrlMatch(app) {
    return function(req, res, next) {
      if (logging) $log('setUrlMatch ${req.url}'.cyan, req.url) // app.routeRegexps)
      var url = req.url.split('?')[0]
      for (var regexp of app.routeRegexps)
      {
        var match = regexp.test(url)
        if (match) {
          req.urlMatch = true
          // $log(regexp , req.urlMatch)
          return next()
        }
      }
      next()
    }
  },

  checkToPersistSession(expressSession) {
    return (req, res, next) => {
      if (logging) $log(`mw.checkToPersistSession ${req.url} ${!isBot(req.get('user-agent'))}`.cyan)
      if (isBot(req.get('user-agent')) || req.urlMatch === undefined) {
        req.session = {}
        req.sessionID = 'unNOwnSZ3Wi8bDEnaKzhygGG2a2RkjZ2' //-- hard coded consistent uid
        return next() //-- Do not track the session
      }
      return expressSession(req, res, next)
    }
  },


  setAnonSessionData(req, res, next) {
    if (logging) $log(`mw.setAnonSessionData ${!req.isAuthenticated()} ${req.url}`.cyan)
    if (isBot(req.header('user-agent'))) return next()

    if (!req.isAuthenticated()) {
      if (!req.session.anonData) req.session.anonData = {}
    }
    else if (req.session.anonData) {
      req.session.anonData = null
      delete req.session.anonData
    }

    next()
  },


  authd(req, res, next) {
    if (logging) $log(`mw.authd[${req.url}] ${req.isAuthenticated()}`.cyan)
    if (req.isAuthenticated()) return next()

    var apiRequest = req.originalUrl.indexOf('/api/') > -1
    if (apiRequest) res.status(401).json({})
    else {
      // save url user is trying to access for graceful redirect after login
      if (req.session) req.session.returnTo = req.url
      res.redirect(config.auth.loginUrl)
      // next()
    }
  },


  authdRedirect(toUrl,statusCode) {
    return (req, res, next) => {
      if (logging) $log(`mw.authdRedirect ${req.isAuthenticated()}`.cyan)
      if (!req.isAuthenticated()) return next()
      else
      {
        res.redirect(statusCode||302, toUrl)
        res.end()
      }
    }
  },


  authDone(req, res, next) {
    if (logging) $log('mw.authDone'.cyan)
    var redirectUrl = config.auth.defaultRedirectUrl
    if (req.session && req.session.returnTo)
    {
      redirectUrl = req.session.returnTo
      delete req.session.returnTo
    }
    res.redirect(redirectUrl)
    res.end()
  },


  authAlreadyDone(req, res, next) {
    if (logging) $log(`mw.authAlreadyDone ${req.isAuthenticated()}`.cyan)
    if (req.isAuthenticated()) { $log('authAlreadyDONE'.red); middleware.authDone(req, res, next) }
    else { next() }
  },


  handleOAuthSuccess(providerName, svcName, fnName) {
    return (req, res, next) => {
      if (logging) $log(`mw.handleOAuthSuccess ${req.authInfo.userinfo}`.cyan)
      var {userinfo,tokeninfo} = req.authInfo
      var svc = require(`../services/${svcName}`)
      svc[fnName].call({user:req.user}, providerName, userinfo, tokeninfo, (e,r) => {
        var redirectQuery = "success=true"
        if (e) {
          $log('handleOAuthSucces.error: '.red, e)
          redirectQuery = `fail=${e.message||e.toString()}`
        }

        delete req.session.doneOAuthReturnToUrl
        res.redirect(`${req.session.returnTo}?${redirectQuery}`)
        res.end()
      })
    }
  },


  setFastSingupPassword(password) {
    return (req, res, next) => {
      if (logging) $log('mw.setFastSingupPassword'.cyan)
      req.body.password = password || 'fast-ap-signup'
      next()
    }
  },

  setReturnTo: setSessionVarFromQuery('returnTo'),

}


module.exports = middleware

