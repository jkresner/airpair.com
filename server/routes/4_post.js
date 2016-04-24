module.exports = function(app, mw, {redirects}) {

  var router = app.honey.Router('posts')
    .use(mw.$.livereload)
    .use([mw.$.badBot, mw.$.rewrites, mw.$.session, mw.$.reqFirst, mw.$.cachedTags])
    .useEnd([mw.$.inflateAds, mw.$.trackPost, mw.$.postPage])

    .get(['^/:adtag/posts/:postslug',
          '^/:adtag/tutorial/:postslug',
          '^/:adtag/tips-n-tricks/:postslug'],
          mw.$.logic('posts.getPublishedBySlug'))

  if (redirects) {
    // var count = 0
    function mapCannonical({current,previous}) {
      // count++
      router.get(current, function(req, res, next) {
        next(null, assign(req.params,{adtag:'canon',postslug:previous}))
      },
      mw.$.logic('posts.getPublishedBySlug'))
    }

    cache['redirects']
      .filter(r => r.type == "canonical-post")
      .forEach(r => mapCannonical(r))
  }


}





