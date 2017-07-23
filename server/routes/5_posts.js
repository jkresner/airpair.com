module.exports = function(app, mw, {canonical}) {
  if (!(canonical||{}).posts) return;

  var posturls = cache['canonical'].post.map(p => p.url)

  var router = honey.Router('posts', {type:'html'})
    .use(mw.$.livereload)
    .use(mw.$.badBot)
    .use(mw.$.throttle)
    .use([mw.$.session, mw.$.reqFirst])
    .useEnd([mw.$.pagePost({})])

    .post(posturls, mw.$.banPOST)
    .get(posturls, mw.$.logic('posts.getPostPublished',{params:['url']}), mw.$.inflateAds, mw.$.trackPost)

    .get('/posts/review/:post',
       mw.$.noBot,
       mw.data.recast('post', 'params.post', {required:true}), //dest:'params.post'
       mw.$.logic('posts.getPostForReview',{params:['post']}),
       (req, res, next) => {
         var reqUrl = req.originalUrl
         var {url,history,title} = req.locals.r
         if ((history||{}).published)
           return res.redirect(301, reqUrl.replace(reqUrl.split('?')[0], url))

         assign(req.locals.htmlHead||{}, { title })
         req.locals.noindex = true

        next()
      })

}
