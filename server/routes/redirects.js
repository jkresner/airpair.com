var RedirectsAPI = require('../api/redirects')
var PostsAPI = require('../api/posts')
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
        PostsAPI.svc.getBySlugForPublishedView(slug, (e,post) => {
          if (!post) {
            if (config.log.redirects) mailman.sendError(`Did not find migrated post ${canonical} for ${slug}`)
            return next(`Post with slug[${slug}] not found`)
          }
          req.post = post
          next()
        })
      , trackView('post')
      , app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post))
    )
}


module.exports = {

  addPatterns(app) {
    //-- Express routes don't handle spaces, so always put in %20
    //-- More so for some reason it's important to test the fully encoded
    //-- Version of the url first
    var router = require('express').Router()

    router.get(/%E2%80%A6/, mw.redirectWithQuery('%E2%80%A6',''))
    router.get(/%20%e2%80%a6/, mw.redirectWithQuery('%20%e2%80%a6',''))
    router.get(/%20%E2%80%A6/, mw.redirectWithQuery('%20%E2%80%A6',''))
    router.get(/%20\.\.\./, mw.redirectWithQuery('%20...',''))
    router.get(/\.\.\./, mw.redirectWithQuery('...',''))
    router.get('/author/*', (req,res) => { res.redirect(301, '/posts/all')})
    router.get("/c\\+\\+", mw.redirectWithQuery("/c++","/posts/tag/c++", "302") )

    return router
  },

  addRoutesFromDb(app, cb) {
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
}
