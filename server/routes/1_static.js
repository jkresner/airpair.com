module.exports = function(app, mw, {static}) {

  if (!static || !static.robots) return

  var dir = require('path').join(config.appDir,static.robots.dir)

  honey.Router('robots', static.robots)

    .files(['robots.txt','humans.txt'],
           mw.req.noCrawlAllow({
             group: 'search',
             content:'User-agent: *\nDisallow: /',
             onDisallow: req => global.$logMW(req, '!seo')
           }), {dir})

    .files(['sitemap.xml',
            'image_sitemap.xml',
            'index_sitemap.xml'],
            mw.req.noCrawlAllow({
              group: 'search',
              content:'',
              onDisallow: req => global.$logMW(req, '!seo')
            }), {dir})

}



