var FirebaseTokenGenerator = require('firebase-token-generator')
var JWT = require('jwt-simple')
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
      var {userinfo,tokeninfo} = req.authInfo
      svcFn.call({user:req.user}, providerName, userinfo, tokeninfo, (e,r) => {
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

  setFirebaseTokenOnSession(req, res, next) {
    if (logging) $log(`mw.setFirebaseTokenOnSession ${req.sessionID} ${req.user==null}`.cyan)
    if (!config.chat.on) return next()
    if (isBot(req.header('user-agent'))) return next()

    var tokenGenerator = new FirebaseTokenGenerator(config.chat.firebase.secret)
    var tokenData, trues, existingToken = req.session.firebaseToken, existingTokenData, existingTokenMetadata;

    if (existingToken) {
      existingTokenMetadata = JWT.decode(existingToken, config.chat.firebase.secret);
      existingTokenData =  existingTokenMetadata.d;
    }
    
    if (req.user) {
      var uid = req.user._id.toString()

      trues = _.map(req.user.roles, function () {return true});
      tokenData = {
        uid: uid,
        //name: req.user.name,
        //avatar: req.user.avatar,
        type: "user",
        // Convert roles to an object for easy lookup in Firebase security rules
        roles: _.object(req.user.roles, trues)
      }

    } else {

      // Generate firebase token using req.sessionID
      tokenData = {
        uid: req.sessionID,
        //name: req.session.name || "Visitor " + req.sessionID.substring(0, 6),
        //avatar: req.session.avatar,
        type: "session"
      }
    }

    if (!existingTokenData || existingTokenData.uid != tokenData.uid || existingTokenMetadata.iat < new Date().getTime()) {
      var expires = parseInt('1' + (new Date().getTime()), 10);
      req.session.firebaseToken = tokenGenerator.createToken(tokenData, {expires:expires});
    }

     $log('firebaseToken in setFirebaseTokenOnSession', req.session.firebaseToken)
    // console.log('session >', req.sessionID, req.session );
    next()
  }
}


module.exports = middleware

