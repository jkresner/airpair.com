import * as Workshops from '../services/workshops'
import * as Posts from '../services/posts'

var vd = {
  // posts: (req, cb) => Posts.getRecentPublished((e,posts) => cb(e, {recent:posts})),
  post: (req, cb) => Posts.getBySlug(req.params.slug, (e,p) => cb(e, p)), 
  workshop: (req, cb) => Workshops.getBySlug(req.params.slug, (e,w) => cb(e, w))
}


export default function(app) {
  
  var router = require('express').Router()

    .get('/:tag/posts/:slug', app.renderHbsViewData('post', vd.post))

    .get('/:tag/workshops/:slug', app.renderHbsViewData('workshop', vd.workshop))

    .get('/workshops-slide/:slug', app.renderHbsViewData('workshopsslide', vd.workshop))

    // .get('/posts*', app.renderHbsViewData('posts', vd.posts))     
     
  return router

}