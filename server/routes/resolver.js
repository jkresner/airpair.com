import PostsAPI from '../api/posts'
var util = require("../../shared/util")

export default function(app) {

  app.get('/posts/thumb/:id', (req,res,next) => {
    $callSvc(PostsAPI.svc.getByIdFromCache, req)(req.params.id, (e,r) => {
      if (e || !r) res.status(404)
      else res.redirect(301, r.meta.ogImage)
      res.end()
    })
  })

  return app

}
