// Assumption is we've already got the redirects on hand
module.exports = function(app, mw, redirects) {

  if (!redirects.on || !redirects.map) return


  var PostsSvc = require('../services/posts')


  var redirectWithQuery = (match, replace, type) =>
    (req, res) => {
      if (!type || type == "301") res.redirect(301, req.url.replace(match,replace))
      else if (type == "302") res.redirect(req.url.replace(match,replace))
      else if (type == "410") res.status(410).send("Sorry, we dropped this page. It's no longer here. Return to <a href='/'>homepage</a>.")
      res.end()
    }


  var routeCanonicalPost = (canonical, slug) =>
    app.get(canonical, mw.$.onFirstReq, function(req, res, next) {
      PostsSvc.getBySlugForPublishedView.call(req, slug, (e, post) => {
        if (!post) {
          // if (config.log.redirects) mailman.sendError(`Did not find canonical post ${canonical} by slug ${slug}`)
          return next(`Post with slug[${slug}] not found`)
        }
        req.post = post
        assign(req.locals, {r:post,htmlHead:post.htmlHead,canonical:post.htmlHead.canonical})
        next()
      })
    }, mw.$.trackPost, mw.$.hybridPage('post'))


  for (var r of redirects.map || []) {
    if (r.type == 'rewrite') {
      var pattern = new RegExp(r.previous,'i')
      var replace = r.current
      app.get(pattern, redirectWithQuery(pattern, replace))
    }
    if (r.type == "301" || r.type == "302") {
      app.get(r.previous, (req,res) => { res.redirect(r.type, r.current) })
    }
    if (r.type == "canonical-post") {
      routeCanonicalPost(r.previous, r.current)
    }
  }

}


  //-- Express routes don't handle spaces, so always put in %20
  //-- More so for some reason it's important to test the fully encoded
  //-- Version of the url first

  // router.get(/%E2%80%A6/, mw.redirectWithQuery('%E2%80%A6',''))
  // router.get(/%20%e2%80%a6/, mw.redirectWithQuery('%20%e2%80%a6',''))
  // router.get(/%20%E2%80%A6/, mw.redirectWithQuery('%20%E2%80%A6',''))
  // router.get(/%20\.\.\./, mw.redirectWithQuery('%20...',''))
  // router.get(/\.\.\./, mw.redirectWithQuery('...',''))
  // router.get("/c\\+\\+", mw.redirectWithQuery("/c++","/posts/tag/c++", "302") )


  //-- TODO : pattern
    // router.get('/author/*', (req,res) => { res.redirect(301, '/posts/all')})
  // DAL.Redirect.getAll({select: '_id previous current type', sort: {previous:1}}, (e,all) => {
    // var tempMigrates = require('./migration')
    // for (var m of tempMigrates) all.push({type:'canonical-post',current:m.o,previous:m.c})

    // for (var r of all) {
    //   if (r.type == 'canonical-post') {
    //     mw.routeCanonicalPost(app, r.current, r.previous)
    //   }
    //   else
    //   {
    //     // $log(`${r.previous} >> ${r.current}`.white)
    //     app.get(r.previous, mw.redirectWithQuery(r.previous,r.current,r.type))
    //   }
    // }

    // cb()
