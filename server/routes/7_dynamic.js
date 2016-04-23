module.exports = function(app, mw) {


  app.get('/bookings/:id/spin*',
    function(req, res, next) {
      API.Bookings.svc.getByIdForSpinning.call(req, req.params.id, req.query.email, (e,r) => {
        if (!r) return res.status(200).send('')
        req.locals.r = r
        next()
      })
    }, mw.$.serverPage('spin'))


  // app.use(app.Router()
  app.use(mw.$.cachedTags)
    // .param('tag', API.Tags.paramFns.getBySlug)
    .param('job', API.Requests.paramFns.getByIdForReview)
    // .param('post', API.Posts.paramFns.getBySlugForPublishedView)



  // for (var slug of ['angularjs']) //,'firebase'
  //   app.get(`/${slug}`, populate.tagPage(slug), trackView('tag'),
  //     app.renderHbsViewData('tag', null, (req, cb) => cb(null, req.tagpage) ))
  for (var slug of ['reactjs','python','node.js','ember.js','keen-io','rethinkdb','ionic','swift','android','ruby'])
    app.get(`^/${slug}`, function(req, res, next) {
      next(null, req.locals.r = _.find(cache.tags, t => t.slug == req.originalUrl.replace(/\//g, '')))
      },
      // mw.$.trackTag,
      mw.$.hybridPage('tag'))


  app.get(['/job/:job','/review/:job'],
    mw.$.badBot, mw.$.session, mw.$.reqFirst,
    mw.$.trackJob,
    mw.$.hybridPage('job'))



  app.get('/posts/review/:id',
    mw.$.noBot,
    function(req, res, next) {
      API.Posts.svc.getByIdForReview.call(req, req.params.id, (e,r) => {
        if (!r) return res.redirect('https://author.airpair.com/')
        else if (r.published) return res.redirect(301, r.url)
        // res.redirect(301, req.originalUrl.replace('/post','https://author.airpair.com'))
        // console.log('html', r.html)
        // req.locals.post = r
        req.locals.r = r
        req.locals.htmlHead = r.htmlHead
        next()
      })
    }, mw.$.postPage)


  app.get('/:tagshort/workshops/:slug',
    mw.$.badBot, mw.$.session, mw.$.reqFirst, mw.$.cachedAds,
    (req, res, next) => {
      var r = _.find(cache.workshops, w => w.url == req.originalUrl)
      r ? next(null, assign(req.locals,{r,htmlHead:r.htmlHead})) : next("Workshop not found")
    },
    mw.$.trackWorkshop,
    mw.$.serverPage('workshop'))

  // )

  $logIt('cfg.route', 'obj   GET', 'lol')



  // .get('/book/:username', function(req, res, next) {
  //   API.Experts.svc.getByUsername.call(req, req.params.username, (e,r) => {
  //     if (!r) return res.redirect('/')
  //     r.meta = { canonical: `https://www.airpair.com/book/${r.username}`, title: r.name }
  //     req.expert = r
  //     req.locals.r = r
  //     req.locals.htmlHead = r.meta
  //     next()
  //   })}, mw.$.hybridPage('book'))

}
