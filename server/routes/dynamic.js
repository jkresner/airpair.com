import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import TagsAPI from '../api/tags'
import RequestsApi from '../api/requests'
var {trackView} = require('../middleware/analytics')
var {authd} = require('../middleware/auth')
var util = require("../../shared/util")

//-- TODO move into database evetuall
var angular = {
  _id: "5149dccb5fc6390200000013",
  desc: 'AngularJS is an open-source JavaScript framework. Its goal is to augment browser-based applications with Model–View–Whatever(MV*) capability and reduce the amount of JavaScript needed to make web applications functional. These types of apps are also frequently known as Single-Page Applications.',
  name: 'AngularJS',
  short: 'Angular',
  slug: 'angularjs',
  soId: 'angularjs'
}

var angularPageMeta = {
  title: "AngularJS Articles, Workshops & Developers ready to help. A top resource!",
  description: "AngularJS Articles, Workshops & Developers ready to help. One of the web's top AngularJS resources - totally worth bookmarking!",
  ogType: "website",
  ogTitle: "AngularJS Articles, Workshops and Developers",
  ogDescription: "One of the best collections of #AngularJS Articles, Live Workshops and Developers on the web",
  ogImage: "http://www.airpair.com/static/img/css/tags/angularjs-og.png",
  ogUrl: "http://www.airpair.com/angularjs",
  canonical: "http://www.airpair.com/angularjs"
}

var setTagForTrackView = (req, res, next) => { req.tag = angular; req.tag.title = req.tag.name; next() }


export default function(app) {

  var router = require('express').Router()

    .param('workshop', WorkshopsAPI.paramFns.getBySlug)
    .param('post', PostsAPI.paramFns.getBySlugWithSimilar)
    .param('postforreview', PostsAPI.paramFns.getByIdForReview)
    .param('review', RequestsApi.paramFns.getByIdForReview)

    .get('/angularjs', setTagForTrackView,
      trackView('tag'),
      app.renderHbsViewData('tag', angularPageMeta,
        (req, cb) => TagsAPI.svc.getTagPage(req.tag, cb) ))

    .get('/posts',
      app.renderHbsViewData('posts', { title: "Software Posts, Tutorials & Articles" },
        (req, cb) => PostsAPI.svc.getAllPublished(cb) ))

    .get('/posts/airpair-v1',
      app.renderHbsViewData('posts', null,
      (req, cb) => PostsAPI.svc.getUsersPublished('hackerpreneur', cb) ))

    .get('/blog',
      app.renderHbsViewData('posts', null,
      (req, cb) => PostsAPI.svc.getUsersPublished('52ad320166a6f999a465fdc5', cb) ))

    .get('/:tag/posts/:post',
      trackView('post'),
      app.renderHbsViewData('post', null, (req, cb) => { cb(null, req.post) })
    )

    .get('/posts/review/:postforreview', authd,
      app.renderHbsViewData('post', null, (req, cb) => {
        req.postforreview.meta = { noindex: true }
        cb(null, req.postforreview)
      })
    )

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
          cb(null,req.review)
        }))

  return router

}
