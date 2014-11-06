import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import TagsAPI from '../api/tags'
import {trackView} from '../identity/analytics/middleware'
import {noTrailingSlash} from '../util/seo/middleware'


var angular = {
  _id: "5149dccb5fc6390200000013",
  desc: 'AngularJS is an open-source JavaScript framework. Its goal is to augment browser-based applications with Model–View–Whatever(MV*) capability and reduce the amount of JavaScript needed to make web applications functional. These types of apps are also frequently known as Single-Page Applications.',
  name: 'AngularJS',
  short: 'Angular',
  slug: 'angularjs',
  soId: 'angularjs'
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

  return router

}
