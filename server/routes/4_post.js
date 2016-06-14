module.exports = function(app, mw, {rules}) {

  if (!(rules||{}).posts) return;

  var posturls = cache['http-rules']['canonical-post'].map(p => p.url)

  var router = app.honey.Router('posts', {type:'html'})
    .use(mw.$.livereload)
    .use([mw.$.badBot, mw.$.session, mw.$.throttle, mw.$.reqFirst, mw.$.cachedTags])
    .useEnd([mw.$.postPage])

    .get(posturls, mw.$.logic('posts.getPostPublished',{params:['url']}), mw.$.inflateAds, mw.$.trackPost)
    .get('/posts/review/:id', mw.$.noBot, mw.$.logic('posts.getPostForReview'), (req, res, next) => {
      var reqUrl = req.originalUrl
      var {url,history,title} = req.locals.r
      if ((history||{}).published)
        return res.redirect(301, reqUrl.replace(reqUrl.split('?')[0], url))

      req.locals.htmlHead.title = title
      req.locals.noindex = true

      next()
    })

    .post(posturls, mw.$.banPOST)

}
