var logging = false;

var isApiRequest = (req) => req.url.indexOf('api') != 0


export function authd(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated())
  {
    var apiRequest = isApiRequest(req)
    
    // save url user is trying to access for graceful redirect after login
    if (req.session && !apiRequest) { 
      req.session.returnTo = req.url 
    }

    if (apiRequest) { res.status(403).json({}) } 
    else { res.status(403).redirect(config.auth.loginUrl) }
  } 
  else
  {
    next()  
  }
}

var authorizeRole = (roleName) => {
  return (req, res, next) => {
    var apiRequest = req.url.indexOf('api') != 0
    if (!req.isAuthenticated || !req.isAuthenticated())
    {
      if (isApiRequest(req)) { res.status(403).json() } 
      else { res.status(403).redirect(config.auth.loginUrl) }
    } 
    else if ( ! _.contains(req.user.roles, roleName) )
    {
      if (isApiRequest(req)) { res.status(403).json() } 
      else { res.status(403).redirect(config.auth.unauthorizedUrl) }
    }
    else 
    {
      next()  
    }
  }
}

export var adm = authorizeRole('admin')
export var pipeliner = authorizeRole('pipeliner')
export var mm = authorizeRole('matchmaker')
export var editor = authorizeRole('editor')


var setReqSessionVar = (varName) => {
  return (req, res, next) => {
    var reqVar = req.query[varName]
    if (reqVar) {
      req.session[varName] = reqVar
      if (logging) { $log(`req.session.${varName}`, reqVar) }
    }
    next()
  }
}

export var setReturnTo = setReqSessionVar('returnTo')
export var setMixpanelId = setReqSessionVar('mixpanelId')
