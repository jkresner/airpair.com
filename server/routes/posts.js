import * as Posts from '../services/posts'

var vd = {
  posts: function(req, cb) {
    Posts.getRecentPublished((e,posts) => { 
      cb(e, {recent:posts})
    })
  },
  post: function(req, cb) {
    Posts.getBySlug(req.params.slug, (e,post) => { 
      cb(e, post)
    })
  }
}


export default function(app) {
  
  var router = require('express').Router()

  router.get(`/:tag/posts/:slug`, app.renderHbsViewData('post', vd.post))
  router.get('/posts', app.renderHbsViewData('posts', vd.posts))     
  router.get('/posts*', app.renderHbs('posts'))     

  return router

}