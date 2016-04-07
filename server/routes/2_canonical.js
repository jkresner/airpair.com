// Assumption is we've already got the redirects on hand
module.exports = function(app, mw, {redirects}) {

  if (!redirects) return


  var resolvePost = (canonicalUrl, slug) =>
    app.get(canonicalUrl,
      mw.$.badBot, mw.$.session, mw.$.onFirstReq,

      (req, res, next) => API.Posts.svc.getBySlugForPublishedView.call(req, slug, (e, post) => {
        if (!post) return next(`Post with slug[${slug}] not found`)
          // if (config.log.redirects) mailman.sendError(`Did not find canonical post ${canonical} by slug ${slug}`)
        req.post = post
        assign(req.locals, {r:post,htmlHead:post.htmlHead})
        next()
      }),

      mw.$.trackPost, mw.$.postPage)


  cache['redirects'].filter(r => r.type == "canonical-post")
    .forEach(r => resolvePost(r.previous, r.current))

}




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
