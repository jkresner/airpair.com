import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import TagsAPI from '../api/tags'
import {trackView} from '../identity/analytics/middleware'
import {noTrailingSlash} from '../util/seo/middleware'


//-- TODO move into database evetuall
var angular = {
  _id: "5149dccb5fc6390200000013",
  desc: 'AngularJS is an open-source JavaScript framework. Its goal is to augment browser-based applications with Model–View–Whatever(MV*) capability and reduce the amount of JavaScript needed to make web applications functional. These types of apps are also frequently known as Single-Page Applications.',
  name: 'AngularJS',
  short: 'Angular',
  slug: 'angularjs',
  soId: 'angularjs'
}


//-- TODO move into database evetuall
var postCanonicals = [
  { c: '/js/javascript-framework-comparison', s: 'angularjs-vs-backbonejs-vs-emberjs' },
  { c: '/javascript/integrating-stripe-into-angular-app', s: 'angularjs-app-with-stripe-payments-integration' },
  { c: '/ruby-on-rails/ruby-experts-pedro-nascimento', s: 'ruby-experts-pedro-nascimento' },
  { c: '/javascript/node-js-tutorial/', s: 'node-js-tutorial-step-by-step-guide-for-getting-started' },
  { c: '/php/php-expert-jorge-colon', s: 'php-expert-jorge-colon-1' },
  { c: '/python/python-expert-josh-kuhn', s: 'python-expert-josh-kuhn-1' },
  { c: '/ruby-on-rails/performance', s: 'rails-performance-what-you-need-to-know' },
  { c: '/ruby-on-rails/rails-teacher-backnol-yogendran', s: 'rails-teacher-backnol-yogendran-1' }
]

function routeCanonicalPost(router, app, canonical, slug) {
  router.get(canonical, noTrailingSlash(), app.renderHbsViewData('post', function (req, cb) {
      PostsAPI.svc.getBySlug(slug, (ee,post) => {
        req.post = post
        req.post.primarytag = post.tags[0]
        PostsAPI.svc.getSimilarPublished(req.post.primarytag, (e,r) => {
          req.post.similar = r
          cb(null,req.post)
        })
      })
    }), trackView('post'))
}

var setTagForTrackView = (req, res, next) => { req.tag = angular; req.tag.title = req.tag.name; next() }


export default function(app) {

  var router = require('express').Router()

    .param('workshop', WorkshopsAPI.paramFns.getBySlug)
    .param('post', PostsAPI.paramFns.getBySlug)

    .get('/angularjs', noTrailingSlash(), setTagForTrackView, trackView('tag'), app.renderHbsViewData('tag',
      (req, cb) => TagsAPI.svc.getTagPage(req.tag, cb) ))

    .get('/posts/all', app.renderHbsViewData('postslist',
      (req, cb) => PostsAPI.svc.getAllPublished(cb) ))

    .get('/posts/airpair-v1', app.renderHbsViewData('postslist',
      (req, cb) => PostsAPI.svc.getUsersPublished('hackerpreneur', cb) ))

    .get('/:tag/posts/:post', noTrailingSlash(), trackView('post'), app.renderHbsViewData('post',
      function(req, cb) {
        req.post.primarytag = req.params.tag
        PostsAPI.svc.getSimilarPublished(req.post.primarytag, (e,r) => {
          req.post.similar = r
          cb(null,req.post)
        })
      })
    )

    .get('/:tag/workshops/:workshop', noTrailingSlash(), trackView('workshop'), app.renderHbsViewData('workshop',
      (req, cb) => { req.workshop.by = req.workshop.speakers[0]; cb(null,req.workshop) }))

    .get('/workshops-slide/:workshop', app.renderHbsViewData('workshopsslide',
      (req, cb) => cb(null,req.workshop) ))


  for (var p of postCanonicals) {
    routeCanonicalPost(router, app, p.c, p.s)
  }

  return router

}
