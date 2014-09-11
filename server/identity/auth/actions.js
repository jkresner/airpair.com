var logging = true;


export function logout(options) {
  return (req, res, next) => {  
    req.logout()
    res.redirect(options.loginUrl)
  }
}


export function shakeDone(req, res, next) {
  var redirectUrl = '/'
  if (req.session.return_to)
  {
    redirectUrl = req.session.return_to
  }
  res.redirect(redirectUrl)
}