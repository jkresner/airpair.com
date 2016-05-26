module.exports = function(app, mw, {redirects}) {

  var router = app.honey.Router('posts', {type:'html'})
    .use(mw.$.livereload)
    .use([mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.cachedTags])
    .useEnd([mw.$.inflateAds, mw.$.trackPost, mw.$.postPage])

  canonMap = r => (req, res, next) => {
    // $log('canonMap', r)
    next(null, assign(req.params,{adtag:'canon'},{postslug:r.match}))
  }

  for (var rule of cache.httpRules['canonical-post'])
    router.get( rule.to, canonMap(rule), mw.$.logic('posts.getPublishedBySlug') )


  router
    .get(['^/:adtag/posts/:postslug',
          '^/:adtag/tutorial/:postslug',
          '^/:adtag/tips-n-tricks/:postslug'],
          mw.$.logic('posts.getPublishedBySlug'))

}
