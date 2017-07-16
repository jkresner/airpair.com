module.exports = function(app, mw, {static,landing}) {
  if (!static) return;


  if (landing && static.img)

    honey.Router('img', static.img)

      .static('/img/software', { dir:`${config.appDir}/${landing.tags.dir}`})

      .get('/posts/thumb/:id', mw.$.badBot, (req,res,next) => {
        var post = cache.posts[req.params.id]
        if (!post) res.status(404)
        else res.redirect(301, post.ogImg)
      })


  if (static.robots)

    honey.Router('robots', static.robots)

      .files(['robots.txt'],
             mw.req.noCrawlAllow({
               group: 'search',
               content:'User-agent: *\nDisallow: /',
               onDisallow: req => global.$logMW(req, '!seo')
             }),
             { dir:`${config.appDir}/web/robots`})

      .files(['sitemap.xml',
              'image_sitemap.xml',
              'index_sitemap.xml'],
              mw.req.noCrawlAllow({
                group: 'search',
                content:'',
                onDisallow: req => global.$logMW(req, '!seo')
              }),
              { dir:`${config.appDir}/web/robots`})


  if (config.env == 'dev')

    honey.Router('fonts', {type:'fonts'})

      .static('/fonts', { dir:`${config.appDir}/web/fonts`})


}



