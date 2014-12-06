import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import TagsAPI from '../api/tags'
import {trackView} from '../identity/analytics/middleware'
import {noTrailingSlash} from '../util/seo/middleware'
var postCanonicals = "./migration"

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
  ogImage: "http://www.airpair.com/v1/img/css/tags/angularjs-og.png",
  ogUrl: "http://www.airpair.com/angularjs",
  canonical: "http://www.airpair.com/angularjs"
}

var setTagForTrackView = (req, res, next) => { req.tag = angular; req.tag.title = req.tag.name; next() }


export default function(app) {

  var router = require('express').Router()

    .param('workshop', WorkshopsAPI.paramFns.getBySlug)
    .param('post', PostsAPI.paramFns.getBySlug)

    .get('/angularjs', noTrailingSlash(), setTagForTrackView,
      trackView('tag'),
      app.renderHbsViewData('tag', angularPageMeta,
        (req, cb) => TagsAPI.svc.getTagPage(req.tag, cb) ))

    .get('/posts/all',
      app.renderHbsViewData('posts', { title: "Software Posts, Tutorials & Articles" },
        (req, cb) => PostsAPI.svc.getAllPublished(cb) ))

    .get('/posts/airpair-v1',
      app.renderHbsViewData('posts', null,
      (req, cb) => PostsAPI.svc.getUsersPublished('hackerpreneur', cb) ))

    .get('/:tag/posts/:post', noTrailingSlash(),
      trackView('post'),
      app.renderHbsViewData('post', null,
        function(req, cb) {
          req.post.primarytag = (req.post.tags) ? req.post.tags[0] : null
          PostsAPI.svc.getSimilarPublished(req.post.primarytag.slug, (e,r) => {
            req.post.similar = r
            cb(null,req.post)
          })
        })
    )

    .get('/workshops',
      app.renderHbsViewData('workshops', { title: "Software Workshops, Webinars & Screencasts" },
        (req, cb) => WorkshopsAPI.svc.getAll(cb) ))

    .get('/:tag/workshops/:workshop', noTrailingSlash(), trackView('workshop'),
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



  return router

}
