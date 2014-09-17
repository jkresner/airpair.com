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
  },
  admposts: function(req, cb) {
    Posts.getAllAdmin((e,posts) => { 
      cb(e, {posts:posts})
    })
  }
}


export default function(app) {
  
  var router = require('express').Router()

  router.get(`/:tag/posts/:slug`, app.renderHbsViewData('post', vd.post))
  // router.get('/posts', app.renderHbsViewData('posts', vd.posts))     
  // router.get('/posts*', app.renderHbs('posts'))     
  router.get('/posts*', app.renderHbsViewData('posts', vd.posts))     

  // -- Temporary
  app.get('/v1/adm', app.renderHbsViewData('admin', vd.admposts) )  

  return router

}