var {isBot,stringToJson}   = require('../../shared/util')
var logging   = false

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


  checkToPersistSession(expressSession) {
    return (req, res, next) => {
      if (logging) $log(`mw.checkToPersistSession ${req.url} ${!isBot(req.get('user-agent'))}`.cyan)
      if (isBot(req.get('user-agent'))) {
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
    if (logging) $log(`mw.authd ${req.isAuthenticated()}`.cyan)
    if (req.isAuthenticated()) return next()

    var apiRequest = req.originalUrl.indexOf('/api/') > -1
    if (apiRequest) res.status(401).json({})
    else {
      // save url user is trying to access for graceful redirect after login
      if (req.session) req.session.returnTo = req.url
      res.redirect(config.auth.loginUrl)
      next()
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


  handleOAuthSuccess(providerName, svcFn) {
    return (req, res, next) => {
      if (logging) $log(`mw.handleOAuthSuccess ${req.authInfo.userinfo}`.cyan)
      var {userInfo,tokeninfo} = stringToJson(req.authInfo)
      svcFn.call({user:req.user}, providerName, userInfo, tokeninfo, (e,r) => {
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


  setFastSingupPassword(req, res, next) {
    if (logging) $log('mw.setFastSingupPassword'.cyan)
    req.body.password = 'fast-ap-signup'
    next()
  },


  setReturnTo: setSessionVarFromQuery('returnTo'),

}


module.exports = middleware

