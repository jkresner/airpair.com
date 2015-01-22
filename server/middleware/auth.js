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
    console.log("Starting setFirebaseTokenOnSession")
    if (logging) $log(`mw.setFirebaseTokenOnSession ${req.sessionID} ${req.user==null}`.cyan)
    if (!config.chat.on) return next()
    if (isBot(req.header('user-agent'))) return next()
    console.log("middle of setFirebaseTokenOnSession")

    var token = middleware.setFirebaseToken(req.user, req.session, req.sessionID);
    
    if (req.session.firebaseToken !== token) {
      req.session.firebaseToken = token;
    }

    //$log('firebaseToken in setFirebaseTokenOnSession', req.session.firebaseToken)
    // console.log('session >', req.sessionID, req.session );
    next()
  },
  
  setFirebaseToken(user, session, sessionID) {
    var tokenGenerator = new FirebaseTokenGenerator(config.chat.firebase.secret)
    var tokenData, trues, existingToken = session.firebaseToken, existingTokenData, existingTokenMetadata;

    if (existingToken) {
      existingTokenMetadata = JWT.decode(existingToken, config.chat.firebase.secret);
      existingTokenData =  existingTokenMetadata.d;
    }
    
    if (user) {
      var uid = user._id.toString()

      trues = _.map(user.roles, function () {return true});
      tokenData = {
        uid: uid,
        //name: req.user.name,
        //avatar: req.user.avatar,
        type: "user",
        // Convert roles to an object for easy lookup in Firebase security rules
        roles: _.object(user.roles, trues)
      }

    } else {

      // Generate firebase token using req.sessionID
      tokenData = {
        uid: sessionID,
        //name: req.session.name || "Visitor " + req.sessionID.substring(0, 6),
        //avatar: req.session.avatar,
        type: "session"
      }
    }
    //console.log("uids>", existingTokenData? existingTokenData.uid : "", tokenData.uid)
    if (!existingTokenData || existingTokenData.uid != tokenData.uid || (existingTokenMetadata.iat*1000) < new Date().getTime()) {
      //console.log("providing new token")
      var token, expires = parseInt(new moment(session.cookie._expires).format('x'), 10);
      //console.log(expires);
      token = tokenGenerator.createToken(tokenData, {expires:expires});
      //console.log(token);
      return token;
    } else {
      return existingToken;
    }
    
    console.log("Running setFirebaseTokenOnSession", session.firebaseToken)
  }
}


module.exports = middleware

