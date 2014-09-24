
export function logout(options) {
  return (req, res, next) => {  
    req.logout()
    res.redirect(options.loginUrl)
  }
}


//-- only used in testing
export function setTestLogin(req, res, next) {
  if (logging) $log('setTestLogin', req.params.id, global.data.sessions[req.params.id])
  var user = global.data.sessions[req.params.id]
  req.logIn( user, (err) => res.json(user) )
}