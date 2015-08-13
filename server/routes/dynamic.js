var API                             = require('../api/_all')
var {trackView}                     = require('../middleware/analytics')
var {authd,noCrawl}                 = require('../middleware/auth')
var {populate}                      = require('../middleware/data')


module.exports = function(app) {


  for (var slug of ['angularjs']) //,'firebase'
    app.get(`/${slug}`, populate.tagPage(slug), trackView('tag'),
      app.renderHbsViewData('tag', null, (req, cb) => cb(null, req.tagpage) ))

  for (var slug of ['reactjs', 'python', 'node.js', 'ember.js', 'keen-io', 'rethinkdb',
    'ionic', 'swift', 'android', 'ruby' ])
    app.get(`^/${slug}`, //trackView('tag'),
      app.renderHbs('base') )


  var router = require('express').Router()

    .param('workshop', API.Workshops.paramFns.getBySlug)
    .param('review', API.Requests.paramFns.getByIdForReview)
    .param('post', API.Posts.paramFns.getBySlugForPublishedView)

    .get('/workshops',
      app.renderHbsViewData('workshops', { title: "Software Workshops, Webinars & Screencasts" },
        (req, cb) => API.Workshops.svc.getAll(cb) ))

    .get('/:tag/workshops/:workshop', trackView('workshop'),
      app.renderHbsViewData('workshop', null,
        (req, cb) => {
          req.workshop.meta = {
            title: req.workshop.name,
            canonical: `https://www.airpair.com/${req.workshop.url}`
          }
          req.workshop.by = req.workshop.speakers[0]; cb(null,req.workshop)
        }))

    .get('/workshops-slide/:workshop',
      app.renderHbsViewData('workshopsslide', {},
        (req, cb) => cb(null,req.workshop) ))


    .get('/review/:review',
      noCrawl('/'),
      //trackView('request'),
      app.renderHbsViewData('review', null,
        (req, cb) => {
          req.review.meta = {
            title: `AirPair | ${util.tagsString(req.review.tags)} Request`,
            canonical: `https://www.airpair.com/review/${req.review._id}`,
            noindex: true
          }
          req.review.brief = util.htmlEscape(req.review.brief)
          for (var sug of req.review.suggested || [])
          {
            if (sug.expertComment)
              sug.expertComment = util.htmlEscape(sug.expertComment)
          }
          cb(null,req.review)
        }))


    .get('/blog',
      app.renderHbsViewData('blog', null,
      (req, cb) => API.Posts.svc.getUsersPublished('52ad320166a6f999a465fdc5', cb) ))


    .get('/posts',
      app.renderHbsViewData('posts', { title: "Software Posts, Tutorials & Articles" },
        (req, cb) => cache.getOrSetCB('postAllPub',API.Posts.svc.getAllPublished,cb) ))


    .get('/:tag/posts/:post',
      trackView('post'),
      app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post)))


    .get('/wiki/experts/:post',
      noCrawl('/posts'),
      authd,
      trackView('post'),
      app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post)))


    .get('/book/:username', function(req, res, next) {
        $callSvc(API.Experts.svc.getByUsername,req)(req.params.username,(e,r)=>{
          if (!r) return res.redirect('/')
          r.meta = { canonical: `https://www.airpair.com/book/${r.username}`, title: r.name }
          req.expert = r
          next()
        })},
        app.renderHbsViewData('book', null, (req, cb) => cb(null, req.expert)))


    .get('/posts/review/:id',
      noCrawl('/posts'),
      function(req, res, next) {
      $callSvc(API.Posts.svc.getByIdForReview, req)(req.params.id, (e,r) => {
        if (!r) return res.redirect('/posts/me')
        else if (r.published) return res.redirect(301, r.url)
        req.post = r
        next()
      })},
      app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post)))


    .get('/posts/preview/:id',
      noCrawl('/posts'),
      authd, populate.user, function(req, res, next) {
      $callSvc(API.Posts.svc.getByIdForPreview, req)(req.params.id, (e,r) => {
        if (!r) return res.redirect('/posts/me')
        if (!_.idsEqual(r.by.userId,req.user._id) &&
            !_.contains(req.user.roles,'admin') &&
            !_.find(r.forkers,(f)=>_.idsEqual(f.userId,req.user._id))
          )
          return next(Error("Post unavailable for you to preview, did you fork it already?"))

        req.post = r
        next()
      })},
      app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post)))


    .get('/bookings/:id/spin*',
      function(req, res, next) {
        $callSvc(API.Bookings.svc.getByIdForSpinning, req)(req.params.id, req.query.email, (e,r) => {
          if (!r) return res.status(200).send('')
          req.booking = r
          next()
      })},
      app.renderHbsViewData('spin', null, (req, cb) => cb(null, req.booking)))


  return router

}
