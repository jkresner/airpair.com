module.exports = (app, mw) =>

  (req, res, next) =>
    Wrappers.GitPublisher.getScopes(req.user, (e,scopes) => {
      req.user.auth.gh.scopes = scopes ? scopes.github : []
      next(e)
    })
