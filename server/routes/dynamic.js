var API                             = require('../api/_all')
// var {populate}                      = require('../middleware/data')


module.exports = function(app, mw) {

  // for (var slug of ['angularjs']) //,'firebase'
  //   app.get(`/${slug}`, populate.tagPage(slug), trackView('tag'),
  //     app.renderHbsViewData('tag', null, (req, cb) => cb(null, req.tagpage) ))


  for (var slug of ['reactjs','python','node.js','ember.js','keen-io','rethinkdb','ionic','swift','android','ruby'])
    app.get(`^/${slug}`,
      mw.analytics.view('tag', analytics.view),
      mw.$.hybridPage('tag') )


  app.use(app.Router()
    .param('workshop', API.Workshops.paramFns.getBySlug)
    .param('review', API.Requests.paramFns.getByIdForReview)
    .param('post', API.Posts.paramFns.getBySlugForPublishedView)


    .get('/workshops', (req, res, next) => {
      mw.analytics.view('workshops', analytics.view),
      API.Workshops.svc.getAll((e,r) => {
        req.locals.r = r
        req.locals.htmlHead = { title: "Software Workshops, Webinars & Screencasts" }
        next()
      })},
      mw.$.serverPage('workshops'))

    .get('/:tag/workshops/:workshop',
        mw.analytics.view('post', analytics.view, {project:d=>assign(d,{})}),
        (req, res, next) => {
        req.workshop.meta = { title: req.workshop.name,
          canonical: `https://www.airpair.com/${req.workshop.url}` }
        req.workshop.by = req.workshop.speakers[0]
        next()
      },
      mw.$.serverPage('workshop'))


  //   .get('/review/:review',
  //     //trackView('request'),
  //     app.renderHbsViewData('review', null,
  //       (req, cb) => {
  //         req.review.meta = {
  //           title: `AirPair | ${util.tagsString(req.review.tags)} Request`,
  //           canonical: `https://www.airpair.com/review/${req.review._id}`,
  //           noindex: true
  //         }
  //         req.review.brief = util.htmlEscape(req.review.brief)
  //         for (var sug of req.review.suggested || [])
  //         {
  //           if (sug.expertComment)
  //             sug.expertComment = util.htmlEscape(sug.expertComment)
  //         }
  //         cb(null,req.review)
  //       }))


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


  //   .get('/book/:username', function(req, res, next) {
  //       $callSvc(API.Experts.svc.getByUsername,req)(req.params.username,(e,r)=>{
  //         if (!r) return res.redirect('/')
  //         r.meta = { canonical: `https://www.airpair.com/book/${r.username}`, title: r.name }
  //         req.expert = r
  //         next()
  //       })},
  //       app.renderHbsViewData('book', null, (req, cb) => cb(null, req.expert)))


    // .get('/posts/preview/:id',
    //   noCrawl('/posts'),
    //   authd, populate.user, function(req, res, next) {
    //     // res.redirect(req.originalUrl.replace('/post','https://author.airpair.com'))
    //   $callSvc(API.Posts.svc.getByIdForPreview, req)(req.params.id, (e,r) => {
    //     $log('e,r',e,r)
    //     if (!r) return res.redirect('https://author.airpair.com')
    //     if (!_.idsEqual(r.by.userId,req.user._id) &&
    //         !_.contains(req.user.roles,'admin') &&
    //         !_.find(r.forkers,(f)=>_.idsEqual(f.userId,req.user._id))
    //       )
    //       return next(Error("Post unavailable for you to preview, did you fork it already?"))

    //     req.post = r
    //     next()
    //     })
    //   },
    //   app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post)))


  //   .get('/bookings/:id/spin*',
  //     function(req, res, next) {
  //       $callSvc(API.Bookings.svc.getByIdForSpinning, req)(req.params.id, req.query.email, (e,r) => {
  //         if (!r) return res.status(200).send('')
  //         req.booking = r
  //         next()
  //     })},
  //     app.renderHbsViewData('spin', null, (req, cb) => cb(null, req.booking)))


  )

}
