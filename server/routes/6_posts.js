module.exports = function(app, mw, {canonical}) {

  if (!(canonical||{}).posts) return;

  var posturls = cache['canonical'].post.map(p => p.url)

  var router = honey.Router('posts', {type:'html'})
    .use(mw.$.livereload)
    .use([mw.$.badBot, mw.$.session, mw.$.throttle, mw.$.reqFirst])
    .useEnd([mw.$.pagePost({})])

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



  // var posturls = ['/js/javascript-comparison']

  // honey.Router('posts',{type:'html'})
  //   .use(mw.$.livereload)
  //   .use(mw.$.session)
    // .use(mw.$.authd)
    // .use(mw.$.inflateMe)

    // .get('/posts', mw.$.postsPage({tmpl:'posts',css:'latest'})
    // .get('/posts/recommended', mw.$.postsPage({tmpl:'posts',css:'latest'})
    // .get('/posts/in-community-review', mw.$.postsPage({tmpl:'posts',css:'latest'})

    // .get(posturls,
    //   mw.$.logic('posts.getPostPublished',
    //     {params:['url']})
    //   , mw.$.inflateAds, mw.$.trackPost)

    // .get('/posts/review/:post',
      // mw.$.noBot,
      // mw.data.recast('post','params.post', {required:true,dest:'params.post'}),
      // mw.$.logic('posts.getPostForReview'),
      // (req, res, next) => {
        // var reqUrl = req.originalUrl
        // var {url,history,title} = req.locals.r
        // if ((history||{}).published)
          // return res.redirect(301, reqUrl.replace(reqUrl.split('?')[0], url))

        // req.locals.htmlHead.title = title
        // req.locals.noindex = true

        // next()
      // },
      // mw.$.postsPage({css:'post'}))

    // .post(posturls, mw.$.banPOST)

}
