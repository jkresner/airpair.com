module.exports = function(app, mw, {ads,tags,redirects}) {

  app.honey.Router('img',{type:'static'})

    .static('/img/software', { dir:`${config.appDir}/${tags.dir}`})

    .get('/posts/thumb/:id', mw.$.noBot, (req,res,next) => {
      var post = cache.posts[req.params.id]
      if (!post) res.status(404)
      else res.redirect(301, post.htmlHead.ogImage)
      res.end()
    })

}



