var logging = true;


export function logout(options) {
  return (req, res, next) => {  
    req.logout()
    res.redirect(options.loginUrl)
  }
}


export function authDone(req, res, next) {
  var redirectUrl = config.auth.defaultRedirectUrl
  if (req.session && req.session.returnTo)
  {
    redirectUrl = req.session.returnTo
    delete req.session.returnTo    
  }
  res.redirect(redirectUrl)
}