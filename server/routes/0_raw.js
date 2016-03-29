module.exports = function(app, mw) {

  // don't want any middleware - sessions etc.
  app.get('/posts/thumb/:id', (req,res,next) => {
    var post = cache.post[req.params.id]
    if (!post) res.status(404)
    else res.redirect(301, post.htmlHead.ogImage)
    res.end()
  })

}
