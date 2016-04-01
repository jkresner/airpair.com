
module.exports = function(app, mw) {


  // for (var slug of ['angularjs']) //,'firebase'
  //   app.get(`/${slug}`, populate.tagPage(slug), trackView('tag'),
  //     app.renderHbsViewData('tag', null, (req, cb) => cb(null, req.tagpage) ))


  for (var slug of ['reactjs','python','node.js','ember.js','keen-io','rethinkdb','ionic','swift','android','ruby'])
    app.get(`^/${slug}`,
      mw.$.trackTag,
      mw.$.hybridPage('tag') )


  app.use(app.Router()
    .param('tag', API.Tags.paramFns.getBySlug)
    .param('workshop', API.Workshops.paramFns.getBySlug)
    .param('job', API.Requests.paramFns.getByIdForReview)
    .param('post', API.Posts.paramFns.getBySlugForPublishedView)
    .use(mw.$.onFirstReq)
    .use(mw.$.cachedTags)
    .get('/workshops',
      (req, res, next) =>
        API.Workshop.svc.getAll((e,r) => {
          req.locals.r = r
          req.locals.htmlHead = { title: "Software Workshops, Webinars & Screencasts" }
          next()
        }), mw.$.serverPage('workshops'))

    .get('/:tag/workshops/:workshop',
        mw.$.trackWorkshop,
        (req, res, next) => {
          req.workshop.meta = { title: req.workshop.name,
            canonical: `https://www.airpair.com/${req.workshop.url}` }
          req.workshop.by = req.workshop.speakers[0]
          next()
        }, mw.$.serverPage('workshop'))


    // .get('/requirements/:job',
    .get('/review/:job',
      mw.$.trackJob,
      (req, res, next) => {
          for (var sug of req.job.suggested || [])
            if (sug.expertComment)
              sug.expertComment = util.htmlEscape(sug.expertComment)
          req.locals.r = req.job
          req.locals.r.brief = util.htmlEscape(req.job.brief)
          req.locals.htmlHead = {
            title: `AirPair | ${util.tagsString(req.review.tags)} Request`,
            canonical: `https://www.airpair.com/review/${req.review._id}`,
            noindex: true
          }
          next()
        }, mw.$.hybridPage('review'))


    .get('/software-experts',
      function(req, res, next) {
        cache.get('postAllPub', API.Posts.svc.getAllPublished, (e, r) => {
          req.locals.r = r
          req.locals.htmlHead = { title: "Software Posts, Tutorials & Articles" }
          next()
        })
      }, mw.$.hybridPage('posts'))


    .get('/:tag/posts/:post', mw.$.trackPost,
      function(req, res, next) {
        req.locals.r = req.post
        req.locals.htmlHead = req.post.htmlHead
        req.locals.canonical = req.post.htmlHead.canonical
        next()
      }, mw.$.hybridPage('post'))


    .get('/posts/review/:id',
      mw.$.noBot,
      function(req, res, next) {
        $callSvc(API.Posts.svc.getByIdForReview, req)(req.params.id, (e,r) => {
          if (!r) return res.redirect('https://author.airpair.com/')
          else if (r.published) return res.redirect(301, r.url)
          // res.redirect(301, req.originalUrl.replace('/post','https://author.airpair.com'))
          console.log('html', r.html)
          req.locals.body = r.html
          req.locals.post = r
          next()
        })
      }, mw.$.hybridPage('post'))


    // .get('/book/:username', function(req, res, next) {
    //   var ExpertsSvc = require('../services/experts')
    //   ExpertsSvc.getByUsername(req.params.username, (e,r) => {
    //     if (!r) return res.redirect('/')
    //     r.meta = { canonical: `https://www.airpair.com/book/${r.username}`, title: r.name }
    //     req.expert = r
    //     req.locals.r = r
    //     req.locals.htmlHead = r.meta
    //     next()
    //   })}, mw.$.hybridPage('book'))


    // .get('/bookings/:id/spin*',
    //   function(req, res, next) {
    //     $callSvc(API.Bookings.svc.getByIdForSpinning, req)(req.params.id, req.query.email, (e,r) => {
    //       if (!r) return res.status(200).send('')
    //       req.booking = r
    //       next()
    //   })},
    //   app.renderHbsViewData('spin', null, (req, cb) => cb(null, req.booking)))
    // )

  )
}
