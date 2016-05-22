module.exports = function(app, mw, {redirects}) {

  var router = app.honey.Router('posts', {type:'html'})
    .use(mw.$.livereload)
    .use([mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.cachedTags])
    .useEnd([mw.$.inflateAds, mw.$.trackPost, mw.$.postPage])

  var adtag = {adtag:'canon'}
  for (var {match,to} of cache.httpRules['canonical-post']) router
    .get(match
      , (req, res, next) => next(null, assign(req.params,adtag,{postslug:to}) )
      , mw.$.logic('posts.getPublishedBySlug') )

  router
    .get(['^/:adtag/posts/:postslug',
          '^/:adtag/tutorial/:postslug',
          '^/:adtag/tips-n-tricks/:postslug'],
          mw.$.logic('posts.getPublishedBySlug'))


}
