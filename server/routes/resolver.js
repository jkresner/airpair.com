
module.exports = function(app) {

  app.get('/posts/thumb/:id', (req,res,next) => {
    var PostsSvc = require("../services/posts")
    $callSvc(PostsSvc.getByIdFromCache, req)(req.params.id, (e,r) => {
      if (e || !r) res.status(404)
      else res.redirect(301, r.meta.ogImage)
      res.end()
    })
  })

  return app

}
