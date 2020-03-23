module.exports = function(app, mw, {canonical}) {

  if (!(canonical||{}).posts)
    return;

  var posturls = cache['canonical'].post.map(p => p.url)

  var router = honey.Router('posts', {type:'html'})
    .use(mw.$.livereload)
    .use(mw.$.noscrape)
    .use(mw.$.throttle)
    .use(mw.$.session)
    .use(mw.$.pagePost({}),{end:true})

    .post(posturls, mw.$.ipban('posturl'))

    .get(posturls,
      mw.$.pd('posts.getPostPublished',{params:['url']}),
      // mw.$.inflateAds,
      mw.$.trackPost)

    .get('/posts/review/:post',
       mw.$.nobot,
       mw.data.recast('post', 'params.post', {required:true}), //dest:'params.post'
       mw.$.pd('posts.getPostForReview',{params:['post']}),
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
