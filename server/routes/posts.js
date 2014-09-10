import posts from '../services/posts'
var postData = { posts:posts }

export default function(app) {
  
  var router = require('express').Router()

  for (var post of posts) 
  { 
    router.get( post.slug, app.renderHbs('post', _.extend(post, postData) ) )
  } 

  router.get('/', app.renderHbs('posts', postData) )

  return router

}