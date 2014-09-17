import * as Posts from '../services/posts'
var marked = require('marked');

export default function(app) {
  
  var router = require('express').Router()

  Posts.getPublished( (e, posts) => 
  {
    for (var p of posts) 
    { 
      Posts.getTableOfContents(p.md, (e, toc) => {
        $log(toc);
        p.toc = marked(toc.toc);
        router.get(p.slug, app.renderHbs('post', p))
      })
    }

    router.get('/*', app.renderHbs('posts', { posts:posts }))   
  })

  return router

}