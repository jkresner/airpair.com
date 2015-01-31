var logging       = false
var authorizeRole = (roleName) => {
  return (req, res, next) => {
    if (!req.isAuthenticated())
    {
      res.status(401).json()
    }
    else if ( ! _.contains(req.user.roles, roleName) )
    {
      res.status(403).json()
    }
    else
    {
      next()
    }
  }
}

  // isRequestOwner: (user, request) ->
  //   return false if !user?
  //   _.idsEqual request.userId, user._id

  // isOrderOwner: (user, order) ->
  //   return false if !user?
  //   _.idsEqual order.userId, user._id

  // isRequestExpert: (user, request) ->
  //   return false if !user?
  //   for s in request.suggested
  //     if _.idsEqual s.expert.userId, user._id
  //       return true
  //   false


var middleware = {


  adm:          authorizeRole('admin'),
  pipeliner:    authorizeRole('pipeliner'),
  mm:           authorizeRole('matchmaker'),
  editor:       authorizeRole('editor'),
  reviewer:     authorizeRole('reviewer'),


  emailv(req, res, next) {
    if (logging) $log(`mw.emailv ${req.url} ${req.user.emailVerified}`.cyan)
    if (req.user.emailVerified) return next()

    res.status(403).send({message:'e-mail not verified'})
    res.end()
  }


}


module.exports = middleware
