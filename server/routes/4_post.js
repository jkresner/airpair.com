module.exports = function(app, mw, {rules}) {

  if (!(rules||{}).posts) return;


  var router = app.honey.Router('posts', {type:'html'})
    .use(mw.$.livereload)
    .use([mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.cachedTags])
    .useEnd([mw.$.postPage])

    .get('/posts/review/:id', mw.$.noBot, mw.$.logic('posts.getPostForReview'), (req, res, next) => {
      var reqUrl = req.originalUrl
      var {url,history,title} = req.locals.r
      if ((history||{}).published)
        return res.redirect(301, reqUrl.replace(reqUrl.split('?')[0], url))

      req.locals.htmlHead.title = title
      req.locals.noindex = true

      next()
    })


  for (var {url} of cache['http-rules']['canonical-post'])
    router.get(url, mw.$.logic('posts.getPostPublished',{params:['url']}), mw.$.inflateAds, mw.$.trackPost)


}
