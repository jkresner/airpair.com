module.exports = function(app, mw, {landing,canonical}) {
  if (!landing) return


  var rr = honey.Router('landing',{type:'html'})
    .use(mw.$.livereload)
    .use(mw.$.abuser)
    .use(mw.$.badBot)
    .use(mw.$.throttle)
    .use([mw.$.session, mw.$.reqFirst])
    .use([mw.$.trackLanding, mw.$.pageLanding], {end:true})

    .get('/', mw.$.inflateLanding('home'),
      mw.res.forbid('home!anon', (({user}) => user), { redirect: req => '/home' }),
      mw.$.cachedPublished,
      (req, res, next) => next(null, assign(req.locals.r, cache.published))
    )

    .get('/login', mw.$.inflateLanding('login'))

    // .get('/typo', mw.res.page('typography',{layout:'landing'}))

    .get('/100k-writing-competition', mw.$.inflateLanding('comp2015'))

  if (!canonical) return

  rr
    .get(['/learn-code','/technologies'], mw.$.inflateLanding('tags'))

    .get(['/software-experts','/posts'], mw.$.inflateLanding('posts'),
      mw.$.cachedPublished,
      // mw.$.inflateAds,
      (req, res, next) => next(null, assign(req.locals.r, cache.published)) )

    .get('/posts/in-community-review',
      mw.$.noBot,
      mw.$.inflateLanding('inreview'),
      mw.$.pd('posts.getPostsSubmitted',{assign:'posts'}))

    .get(cache.canonical.tag.map(t => t.url),
      mw.$.inflateLanding('tag'),
      mw.$.pd('posts.getPostsByTag',{params:['url']}))


}

