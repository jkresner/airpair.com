module.exports = function(app, mw, {static,landing}) {
  if (!static) return;


  if (config.env == 'dev')

    app.honey.Router('fonts', {type:'fonts'})

      .static('/fonts', { dir:`${config.appDir}/web/fonts`})


  if (static.img)

    app.honey.Router('img', static.img)

      .static('/img/software', { dir:`${config.appDir}/${landing.tags.dir}`})

      .get('/posts/thumb/:id', mw.$.badBot, (req,res,next) => {
        var post = cache.posts[req.params.id]
        if (!post) res.status(404)
        else res.redirect(301, post.ogImg)
      })


  if (static.robots)

    app.honey.Router('robots', static.robots)

      .files(['sitemap.xml',
              'image_sitemap.xml',
              'index_sitemap.xml',
              'robots.txt'],
             mw.$.nonSearch, { dir:`${config.appDir}/web/robots`})


}



