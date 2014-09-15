import * as Posts from '../services/posts'


export default function(app) {
  
  var router = require('express').Router()

  Posts.getAll( (e, posts) => 
  {
    for (var p of posts) 
    { 
      router.get(p.slug, app.renderHbs('post', p))
    }

    router.get('/*', app.renderHbs('posts', { posts:posts }))   
  })

  return router

}