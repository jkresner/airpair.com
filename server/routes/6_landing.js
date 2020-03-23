module.exports = function(app, mw, {landing,canonical}) {

  if (!landing)
    return;

  let r = honey.Router('landing',{type:'html'})
    .use(mw.$.livereload)
    .use(mw.$.noscrape)
    .use(mw.$.throttle)
    .use(mw.$.session)
    .use([mw.$.trackLanding, mw.$.pageLanding], {end:true})

    // .get('/typo', mw.res.page('typography',{layout:'landing'}))

    .get('/login', mw.$.pd_landing('login'))

    .get('/100k-writing-competition', mw.$.pd_landing('comp2015'))

    .get(['/learn-code','/technologies'], mw.$.pd_landing('tags'))


  if (canonical.tags) r
    .get(cache.canonical.tag.map(t => t.url),
      mw.$.pd_landing('tag'),
      mw.$.pd('posts.getPostsByTag', { params:['url'] }))

  r
    // mw.$.inflateAds,
    // .get('/posts/in-community-review',
    //   mw.$.noBot,
    //   mw.$.pd_landing('inreview'),
    //   mw.$.pd('posts.getPostsSubmitted',{assign:'posts'}))

    .use(mw.$.cached('posts','recommended', {assign:'locals.r'}))

    .get(['/software-experts','/posts'],
      mw.$.pd_landing('posts'))

    .get('/',
      mw.res.forbid('home!anon', (r=>r.user), { redirect: r => '/home' }),
      mw.$.pd_landing('home'))



}

