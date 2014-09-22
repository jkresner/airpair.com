
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

//-- only used in testing
export function setTestLogin(req, res, next) {
  if (logging) $log('setTestLogin', req.params.id, global.data.sessions[req.params.id])
  req.logIn(global.data.sessions[req.params.id], (err) => next(err) )
}