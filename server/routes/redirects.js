import RedirectsAPI from '../api/redirects'
import PostsAPI from '../api/posts'
var {trackView} = require('../middleware/analytics')


var mw = {

  redirectWithQuery:(match, replace, type) =>
    (req, res) => {
      if (type == "301") res.redirect(301, req.url.replace(match,replace))
      else if (type == "302") res.redirect(req.url.replace(match,replace))
      else if (type == "410") res.status(410).send("Sorry, we dropped this page. It's no longer here. Return to <a href='/'>homepage</a>.")
      res.end()
    },

  routeCanonicalPost:(app, canonical, slug) =>
    app.get(canonical,
      (req, res, next) =>
        PostsAPI.svc.getBySlugWithSimilar(slug, (e,post) => {
          if (!post) {
            if (winston) winston.error(`Did not find migrated post ${canonical} for ${slug}`)
            return next(`Post with slug[${slug}] not found`)
          }
          req.post = post
          next()
        })
      , trackView('post')
      , app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post))
    )
}


export function addPatterns(app) {
  //-- Express routes don't handle spaces, so always put in %20
  //-- More so for some reason it's important to test the fully encoded
  //-- Version of the url first

  app.get(/%E2%80%A6/, mw.redirectWithQuery('%E2%80%A6',''))
  app.get(/%20%e2%80%a6/, mw.redirectWithQuery('%20%e2%80%a6',''))
  app.get(/%20%E2%80%A6/, mw.redirectWithQuery('%20%E2%80%A6',''))
  app.get(/%20\.\.\./, mw.redirectWithQuery('%20...',''))
  app.get(/\.\.\./, mw.redirectWithQuery('...',''))
  app.get('/author/*', (req,res) => { res.redirect(301, '/posts/all')})
  app.get("/c\\+\\+", mw.redirectWithQuery("/c++","/posts/tag/c++", "302") )

  return app
}


export function addRoutesFromDb(app, cb) {
  if (!config.redirects.on) return cb()

  RedirectsAPI.svc.getAllRedirects((e,all) =>{
    var tempMigrates = require('./migration')
    for (var m of tempMigrates) all.push({type:'canonical-post',current:m.o,previous:m.c})

    for (var r of all) {
      if (r.type == 'canonical-post') {
        mw.routeCanonicalPost(app, r.current, r.previous)
      }
      else
      {
        // $log(`${r.previous} >> ${r.current}`.white)
        app.get( r.previous, mw.redirectWithQuery(r.previous,r.current,r.type))
      }
    }

    cb()
  })
}
