module.exports = function(app, mw, {redirects}) {

  if (!redirects) return

  var count = 0

  var router = app.honey.Router('posts')
    .use([mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.cachedTags, mw.$.cachedAds])
    .use([mw.$.inflateAds, mw.$.trackPost, mw.$.postPage], {end:true})

  cache['redirects']
    .filter(r => r.type == "canonical-post")
    .forEach(r =>
      router.get(r.current, (req, res, next) =>
        (count++) + API.Posts.svc.getBySlugForPublishedView.call(req, r.previous, (e, r) => {
          req.post = r
          assign(req.locals,{r,htmlHead:r?r.htmlHead:null})
          next(r ? null : `Canonical[${current}] for post.slug[${slug}] not found`)
        })
    ))


  router.get(['^/:adtag/posts/:postslug',
              '^/:adtag/tutorial/:postslug',
              '^/:adtag/tips-n-tricks/:postslug'],
              mw.$.logic('posts.getPublishedBySlug'))

    // mw.$.recast('post','param.postslug', {dest:'locals.r'})
    // (req, res, next) => {
    //   app.meanair.logic.posts.getPublishedBySlug(req.params.post, (e,r) => {
    //     $log('post:post.view|pre.render', req.locals.r.htmlHead, req.locals.r.url)
    //     next(null, req.locals.htmlHead = req.locals.r.htmlHead)
    //   })
    // },)

  // $logIt('cfg.route', `canonical:GET`, `${count} posts`)

}





