var logging = false;


export function authd(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated())
  {
    var apiRequest = req.url.indexOf('api') != 0
    
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
