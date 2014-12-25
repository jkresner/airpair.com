var logging = false;
var util = require('../../../shared/util')
var isApiRequest = (req) => req.originalUrl.indexOf('/api/') > -1


export function setAnonSessionData(req, res, next) {
  if (util.isBot(req.header('user-agent'))) return next()

  if (!req.isAuthenticated || !req.isAuthenticated())
  {
    if (!req.session.anonData) req.session.anonData = {}
  }
  else
  {
    req.session.anonData = null
  }
  next()
}


export function authd(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated())
  {
    var apiRequest = isApiRequest(req)

    // save url user is trying to access for graceful redirect after login
    if (req.session && !apiRequest) {
      req.session.returnTo = req.url
    }

    if (apiRequest) { res.status(401).json({}) }
    else { res.redirect(config.auth.loginUrl) }
  }
  else
  {
    next()
  }
}


export function emailv(req, res, next) {
	if (!req.user.emailVerified)
	{
		res.status(403).send({message:'e-mail not verified'})
		res.end()
	}
	else
	{
		next()
	}
}


var authorizeRole = (roleName) => {
  return (req, res, next) => {
    // var apiRequest = req.url.indexOf('api') != 0
    if (!req.isAuthenticated || !req.isAuthenticated())
    {
      // if (isApiRequest(req)) {
      res.status(401).json()
      // }
      // else {
      // res.status(403).redirect(config.auth.loginUrl)
      // }
    }
    else if ( ! _.contains(req.user.roles, roleName) )
    {
      // if (isApiRequest(req)) {
      res.status(403).json()
      // }
      // else { res.redirect(config.auth.unauthorizedUrl) }
    }
    else
    {
      next()
    }
  }
}


export function authDone(req, res, next) {
  //$log('authDone', config.auth.defaultRedirectUrl)
  var redirectUrl = config.auth.defaultRedirectUrl
  if (req.session && req.session.returnTo)
  {
    redirectUrl = req.session.returnTo
    delete req.session.returnTo
  }
  res.redirect(redirectUrl)
  res.end()
}

export function alreadyAuthd(req, res, next) {
  if (req.user)
    return authDone(req, res, next)
  next()
}



export var adm = authorizeRole('admin')
export var pipeliner = authorizeRole('pipeliner')
export var mm = authorizeRole('matchmaker')
export var editor = authorizeRole('editor')


var setSessionVarFromQuery = (varName) => {
  return (req, res, next) => {
    var reqVar = req.query[varName]
    if (reqVar) {
      req.session[varName] = reqVar
      if (logging) { $log(`req.session.${varName}`, reqVar) }
    }
    next()
  }
}

export var setReturnTo = setSessionVarFromQuery('returnTo')
export var setMixpanelId = setSessionVarFromQuery('mixpanelId')
