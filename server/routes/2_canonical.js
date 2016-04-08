module.exports = function(app, mw, {redirects}) {

  if (!redirects) return

  var count = 0

  cache['redirects']
    .filter(r => r.type == "canonical-post")
    .forEach(r => {
      count++;
      app.get(r.current,
        mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.cachedTags, mw.$.cachedAds,
        (req, res, next) =>
          API.Posts.svc.getBySlugForPublishedView.call(req, r.previous, (e, r) => {
            req.post = r
            assign(req.locals,{r,htmlHead:r?r.htmlHead:null})
            next(r ? null : `Canonical[${current}] for post.slug[${slug}] not found`)
          })
        , mw.$.inflateAds, mw.$.trackPost, mw.$.postPage)
      })

  $logIt('cfg.route', `canonical:GET`, `${count} posts`)

}





