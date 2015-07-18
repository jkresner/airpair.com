import WorkshopsAPI                 from '../api/workshops'
import PostsAPI                     from '../api/posts'
import TagsAPI                      from '../api/tags'
import RequestsApi                  from '../api/requests'
import ExpertsApi                   from '../api/experts'
var {trackView}                     = require('../middleware/analytics')
var {authd}                         = require('../middleware/auth')
var {populate}                      = require('../middleware/data')


module.exports = function(app) {


  for (var slug of ['angularjs']) //,'firebase'
    app.get(`/${slug}`, populate.tagPage(slug), trackView('tag'),
      app.renderHbsViewData('tag', null, (req, cb) => cb(null, req.tagpage) ))

  for (var slug of ['reactjs', 'python', 'node.js', 'ember.js', 'keen-io', 'rethinkdb',
    'ionic-framework', 'swift', 'android', 'ruby' ])
    app.get(`^/${slug}`, //trackView('tag'),
      app.renderHbs('base') )


  var router = require('express').Router()

    .param('workshop', WorkshopsAPI.paramFns.getBySlug)
    .param('review', RequestsApi.paramFns.getByIdForReview)
    .param('post', PostsAPI.paramFns.getBySlugForPublishedView)

    .get('/workshops',
      app.renderHbsViewData('workshops', { title: "Software Workshops, Webinars & Screencasts" },
        (req, cb) => WorkshopsAPI.svc.getAll(cb) ))

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


    .get('/review/:review', //trackView('request'),
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
      (req, cb) => PostsAPI.svc.getUsersPublished('52ad320166a6f999a465fdc5', cb) ))


    .get('/posts',
      app.renderHbsViewData('posts', { title: "Software Posts, Tutorials & Articles" },
        (req, cb) => cache.getOrSetCB('postAllPub',PostsAPI.svc.getAllPublished,cb) ))


    .get('/:tag/posts/:post',
      trackView('post'),
      app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post)))


    .get('/wiki/experts/:post',
      authd,
      trackView('post'),
      app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post)))


    .get('/book/:username', function(req, res, next) {
        $callSvc(ExpertsApi.svc.getByUsername,req)(req.params.username,(e,r)=>{
          if (!r) return res.redirect('/')
          r.meta = { canonical: `https://www.airpair.com/book/${r.username}`, title: r.name }
          req.expert = r
          next()
        })},
        app.renderHbsViewData('book', null, (req, cb) => cb(null, req.expert)))


    .get('/posts/review/:id', function(req, res, next) {
      $callSvc(PostsAPI.svc.getByIdForReview, req)(req.params.id, (e,r) => {
        if (!r) return res.redirect('/posts/me')
        else if (r.published) return res.redirect(301, r.url)
        req.post = r
        next()
      })},
      app.renderHbsViewData('post', null, (req, cb) => cb(null, req.post)))


    .get('/posts/preview/:id', authd, populate.user, function(req, res, next) {
      $callSvc(PostsAPI.svc.getByIdForPreview, req)(req.params.id, (e,r) => {
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





  return router

}
