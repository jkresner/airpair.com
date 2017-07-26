module.exports = function(app, mw, {static}) {

  if (!static) return

  if (!static.robots) return

  var dir = require('path').join(config.appDir,static.robots.dir)

  honey.Router('robots', static.robots)

    .files(['humans.txt'], {dir})

    .files(['robots.txt']
           , mw.req.noCrawlAllow({
             group: 'search|other',
             content:'User-agent: *\nDisallow: /',
             onDisallow: req => $log(honey.log.mw(req, '!seo'))
           })
           , {dir})

    .files(['sitemap.xml',
            'image_sitemap.xml',
            'index_sitemap.xml']
            , mw.req.noCrawlAllow({
              group: 'search',
              content:'',
              onDisallow: req => $log(honey.log.mw(req, '!seo'))
            })
            , {dir})

}



