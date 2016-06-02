module.exports = function(app, mw, {rules}) {

  if (!(rules||{}).posts) return;


  var router = app.honey.Router('posts', {type:'html'})
    .use(mw.$.livereload)
    .use([mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.cachedTags])
    .useEnd([mw.$.inflateAds, mw.$.trackPost, mw.$.postPage])

  canonMap = postslug => (req, res, next) =>
    next(null, assign(req.params,{adtag:'canon',postslug}))

  for (var {url,id} of cache['http-rules']['canonical-post'])
    router.get(url, canonMap(id), mw.$.logic('posts.getPublishedBySlug'))


}
