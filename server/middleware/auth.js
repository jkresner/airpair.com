var FirebaseTokenGenerator = require('firebase-token-generator')
var JWT = require('jwt-simple')
var {isBot}   = require('../../shared/util')
var logging   = true

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


  setFastSingupPassword(req, res, next) {
    if (logging) $log('mw.setFastSingupPassword'.cyan)
    req.body.password = 'fast-ap-signup'
    next()
  },


  setReturnTo: setSessionVarFromQuery('returnTo'),

  setFirebaseTokenOnSession(req, res, next) {
    if (logging) $log(`mw.setFirebaseTokenOnSession ${req.sessionID} ${req.user}`.cyan)
    var tokenGenerator = new FirebaseTokenGenerator(config.auth.firebase.secret)
    var tokenData, trues, existingToken = req.session.firebaseToken, existingTokenData;
    
    if (existingToken) {
      existingTokenData = JWT.decode(existingToken,  config.auth.firebase.secret).d;
    }
    
    console.log('Current token data>', existingTokenData);
        
    $log('fb-tok', config.auth.firebase.secret)
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
      
      $log('logged in', tokenData)
    } else {
      $log('anonyous', req.session)
      
      // Generate firebase token using req.sessionID
      tokenData = {
        uid: req.sessionID,
        //name: req.session.name || "Visitor " + req.sessionID.substring(0, 6),
        //avatar: req.session.avatar,
        type: "session"
      }
    }
    
    console.log("token data>", tokenData)
  
    if (!existingTokenData || existingTokenData.uid != tokenData.uid) {
      req.session.firebaseToken = tokenGenerator.createToken(tokenData);
    }
  
    $log('firebaseToken in setFirebaseTokenOnSession', req.session.firebaseToken)
    console.log('session >', req.sessionID, req.session );
    next()
  }
}


module.exports = middleware

