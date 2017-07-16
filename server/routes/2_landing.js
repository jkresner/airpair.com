module.exports = function(app, mw, {landing}) {

  if (!landing) return
  
  honey.projector['routes'].Project.tagged(cache.canonical)

  
  honey.Router('landing',{type:'html'})
    .use(mw.$.livereload)
    .use([mw.$.badBot, mw.$.throttle, mw.$.session, mw.$.reqFirst])
    .use([mw.$.trackLanding, mw.$.pageLanding], {end:true})

    .get('/', mw.$.inflateLanding('home'),
      mw.res.forbid('home!anon', function({user}) { if (user) return 'authd' }, { redirect: req => '/home' }))

    // .get(['/learn-code','/technologies'], mw.$.inflateLanding('tags'))

    // .get(canonical.tag.map(t => t.url),
    //   mw.$.inflateLanding('tag'),
    //   mw.$.logic('posts.getPostsByTag',{params:['url']}))

    // .get(['/software-experts','/posts'], mw.$.inflateLanding('posts'),
    //   mw.$.cachedPublished, mw.$.inflateAds,
    //   (req, res, next) => next(null, assign(req.locals.r, cache.published)) )

    // .get('/posts/in-community-review',
    //   mw.$.noBot,
    //   mw.$.inflateLanding('inreview'),
    //   mw.$.logic('posts.getPostsSubmitted',{assign:'posts'})
    // )

    // .get('/100k-writing-competition', mw.$.inflateLanding('comp2015'))

    // .get('/workshops', mw.$.inflateLanding('workshops'), mw.$.inflateAds)
}

