import WorkshopsAPI from '../api/workshops'
import PostsAPI from '../api/posts'
import TagsAPI from '../api/tags'
import {trackView} from '../identity/analytics/middleware'
import {noTrailingSlash} from '../util/seo/middleware'


export default function(app) {

  var router = require('express').Router()

    .param('workshop', WorkshopsAPI.paramFns.getBySlug)
    .param('post', PostsAPI.paramFns.getBySlug)

    // .get('/angularjs', app.renderHbsViewData('post',
    //   (req, cb) => PostsAPI.svc.getPublishedById('542c4b4f8e66ce0b00c885a4', cb) ))

    .get('/angularjs', app.renderHbsViewData('tag',
      (req, cb) => TagsAPI.svc.getTagPage('angularjs', cb) ))

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
