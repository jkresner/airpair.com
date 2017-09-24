module.exports = function(app, mw, {static}) {

  if (!(static||{}).robots) return

  let dir = join(config.appDir, static.robots.dir)

  honey.Router('robots', static.robots)

    .files(['humans.txt'], {dir})

    .files(['robots.txt']
           , mw.$.seobot({
             group: 'search',
             content:'User-agent: *\nDisallow: /admin',
             onDisallow: req => honey.log.mw.data(req, '!seo')
           })
           , {dir})

    .files(['sitemap.xml',
            'image_sitemap.xml',
            'index_sitemap.xml']
            , mw.$.seobot({
              group: 'search',
              content:'',
              onDisallow: req => honey.log.mw.data(req, '!seo')
            })
            , {dir})

}



