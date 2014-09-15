var logging = false;


export function authd(options) 
{
  return (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated())
    {
      // save url user is trying to access for graceful redirect after login
      if (req.session && !options.isApiRequest) { 
        req.session.returnTo = req.url 
      }

      if (options.isApiRequest) { res.send(403, {}) } 
      else { res.redirect(options.loginUrl) }
    } 
    else
    {
      next()  
    }
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
