module.exports = function(app, mw, {httpRules}) {
  if (!httpRules.posts) return;

  var router = app.honey.Router('posts', {type:'html'})
    .use(mw.$.livereload)
    .use([mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.cachedTags])
    .useEnd([mw.$.inflateAds, mw.$.trackPost, mw.$.postPage])

  canonMap = postslug => (req, res, next) =>
    next(null, assign(req.params,{adtag:'canon',postslug}))

  for (var {url,slug} of cache.httpRules['canonical-post'])
    router.get(url, canonMap(slug), mw.$.logic('posts.getPublishedBySlug'))

}
